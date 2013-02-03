package com.mHacks.surroundsound;

import static com.mHacks.surroundsound.CommonUtilities.DISPLAY_MESSAGE_ACTION;
import static com.mHacks.surroundsound.CommonUtilities.SENDER_ID;
import static com.mHacks.surroundsound.CommonUtilities.SERVER_URL;

import java.io.File;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.Toast;

import com.google.android.gcm.GCMRegistrar;
import com.handmark.pulltorefresh.library.PullToRefreshBase;
import com.handmark.pulltorefresh.library.PullToRefreshBase.OnRefreshListener;
import com.handmark.pulltorefresh.library.PullToRefreshListView;
import com.mHacks.surroundsound.models.LoungeObect;
import com.mHacks.surroundsound.utils.LoungeListAdapter;
import com.mHacks.surroundsound.utils.MyLocationListener;
import com.mHacks.surroundsound.web.AsyncHttpPost;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.utils.StorageUtils;

public class LoungeListActivity extends Activity {

	public PullToRefreshListView pullToRefreshView;

	private Context c;

	private SharedPreferences prefs;
	private String genId;
	
	private ArrayList<LoungeObect> lounges = new ArrayList<LoungeObect>();

	private AsyncTask<Void, Void, Void> mRegisterTask;

	private ImageLoader mImageLoader;

	private JSONObject sentLounge = new JSONObject();

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.lounglist_layout);
		c = this;

		
		prefs = PreferenceManager.getDefaultSharedPreferences(this);
		getArtists();

		setupGeoLoc();

		initImageLoader();

			registerGCM();
		pullToRefreshView = (PullToRefreshListView) findViewById(R.id.listView1);

		testPushGeo();

	}

	public void initImageLoader() {
		File cacheDir = StorageUtils.getCacheDirectory(this);
		ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(
				this).build();

		DisplayImageOptions options = new DisplayImageOptions.Builder()
				.showImageForEmptyUri(R.drawable.placeholder).build();

		ImageLoader.getInstance().init(config);

		mImageLoader = ImageLoader.getInstance();
	}

	private void drawList(String result) throws JSONException {

		JSONArray jArray = null;
		try {
			jArray = new JSONArray(result);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (jArray.length() != 0) {
			lounges.clear();
		}

		for (int i = 0; i < jArray.length(); i++) {

			JSONObject newObject = null;
			try {
				newObject = jArray.getJSONObject(i);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			LoungeObect newLounge = new LoungeObect();

			try {
				newLounge.setLoungeId(newObject.getString("_id"));
			} catch (Exception e) {
				newLounge.setLoungeId("Not Available");
			}

			try {
				newLounge.setLoungeName(newObject.getString("name"));
			} catch (Exception e) {
				newLounge.setLoungeName("Not Available");
			}
			try {
				newLounge.setLoungePlaying("Now Playing: "
						+ newObject.getString("playing"));
			} catch (Exception e) {
				newLounge.setLoungePlaying("Now Playing: " + "Not Available");
			}

			try {
				if (newObject.getString("loungePassword") == null
						|| newObject.getString("loungePassword") == "") {
					newLounge.setLoungeLocked(false);
				} else {
					newLounge.setLoungeLocked(true);
				}
			} catch (Exception e) {
				newLounge.setLoungeLocked(false);
			}

			try {
				newLounge.setLoungeAlbumURL(newObject.getString("albumCover"));
			} catch (Exception e) {
				newLounge.setLoungeAlbumURL("null");
			}

			lounges.add(newLounge);
		}

		LoungeListAdapter adapter = new LoungeListAdapter(this,
				R.layout.loungelist_object, lounges, mImageLoader);

		pullToRefreshView.getRefreshableView().setAdapter(adapter);

		pullToRefreshView.onRefreshComplete();

		pullToRefreshView.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, View view, int pos,
					long id) {
				// Toast.makeText(c, lounges.get(pos - 1).getLoungeId(),
				// Toast.LENGTH_LONG).show();
				try {
					sentLounge.put("id", lounges.get(pos - 1).getLoungeId());
					sentLounge.put("genId", prefs.getString("genId", ""));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
				postJSON(sentLounge,
						"http://surroundsound.herokuapp.com/postArtists");

				Intent intent = new Intent(c, LoungeActivity.class);
				startActivity(intent);
			}
		});

		pullToRefreshView
				.setOnRefreshListener(new OnRefreshListener<ListView>() {
					@Override
					public void onRefresh(
							PullToRefreshBase<ListView> refreshView) {
						// Do work to refresh the list here.
						testPushGeo();

					}
				});

	};

	private void testPushGeo() {
		JSONObject geoLoc = new JSONObject();

		JSONArray longLat = new JSONArray();

		try {
			longLat.put("42.280681");
			longLat.put("-83.733818");

			geoLoc.put("geo", longLat);

			postGPS(geoLoc, "http://surroundsound.herokuapp.com/queryLounges");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void setupGeoLoc() {
		/* Use the LocationManager class to obtain GPS locations */
		LocationManager mlocManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

		LocationListener mlocListener = new MyLocationListener(
				this.getApplicationContext(), this);
		mlocManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0,
				mlocListener);
	}

	private class GetDataTask extends AsyncTask<Void, Void, String[]> {

		protected void onPostExecute(String[] result) {
			// Call onRefreshComplete when the list has been refreshed.

			super.onPostExecute(result);
		}

		@Override
		protected String[] doInBackground(Void... params) {

			return null;
		}
	}

	// get rid of receivers.
	@Override
	protected void onDestroy() {
		if (mRegisterTask != null) {
			mRegisterTask.cancel(true);
		}
		unregisterReceiver(mHandleMessageReceiver);
		GCMRegistrar.onDestroy(this);
		super.onDestroy();
	}
	
	//This is the broadcastreceiver. Technically, it would handle the watch broadcasts as well. I just don't have anything handling that right now.
	
	//Id check if we had an intent with an extra called "pebblemessage" then launch that side of the code if there was.
	private final BroadcastReceiver mHandleMessageReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String newMessage = intent.getExtras().getString("message");
			if (newMessage.contains("update")) {
			//	UpdateStocks();
				// Toast.makeText(c, "UPDATE", Toast.LENGTH_SHORT).show();
			} else if (!newMessage.contains("nothing")
					&& !newMessage.contains("register")
					&& !newMessage.contains("REGISTERED")) {
				// Toast.makeText(context, newMessage,
				// Toast.LENGTH_LONG).show();
				registered(newMessage);
			}
			// mDisplay.append("YAY!" + "\n");
		}
	};

	private void checkNotNull(Object reference, String name) {
		if (reference == null) {
			throw new NullPointerException("error thing" + name);
		}
	}

	// If we got registered, store the generated Id
	public void registered(String newgenId) {
		SharedPreferences.Editor editor = prefs.edit();
		genId = newgenId;
		editor.putString("genId", genId);
		editor.commit();

	}

	private void registerGCM() {
		checkNotNull(SERVER_URL, "SERVER_URL");
		checkNotNull(SENDER_ID, "SENDER_ID");
		// Make sure the device has the proper dependencies.
		GCMRegistrar.checkDevice(this);
		// Make sure the manifest was properly set - comment out this line
		// while developing the app, then uncomment it when it's ready.
		GCMRegistrar.checkManifest(this);
		// mDisplay = (TextView) findViewById(R.id.display);
		registerReceiver(mHandleMessageReceiver, new IntentFilter(
				DISPLAY_MESSAGE_ACTION));
		final String regId = GCMRegistrar.getRegistrationId(this);
		if (regId.equals("")) {
			// Automatically registers application on startup.
			GCMRegistrar.register(this, SENDER_ID);
		} else {
			// Device is already registered on GCM, check server.
			if (GCMRegistrar.isRegisteredOnServer(this)) {
				// Skips registration.
				// mDisplay.append(getString(R.string.already_registered) +
				// "\n");
			} else {
				// Try to register again, but not in the UI thread.
				// It's also necessary to cancel the thread onDestroy(),
				// hence the use of AsyncTask instead of a raw thread.
				final Context context = this;
				mRegisterTask = new AsyncTask<Void, Void, Void>() {

					@Override
					protected Void doInBackground(Void... params) {
						boolean registered = ServerUtilities.register(context,
								regId, genId);
						// At this point all attempts to register with the app
						// server failed, so we need to unregister the device
						// from GCM - the app will try to register again when
						// it is restarted. Note that GCM will send an
						// unregistered callback upon completion, but
						// GCMIntentService.onUnregistered() will ignore it.
						if (!registered) {
							GCMRegistrar.unregister(context);
						}
						return null;
					}

					@Override
					protected void onPostExecute(Void result) {
						mRegisterTask = null;
					}

				};
				mRegisterTask.execute(null, null, null);
			}

		}
	}

	public void getArtists() {
		// Make your cursor parameters:
		// The URI (Common external music locations);
		Uri allsongsuri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

		// Only pick if its actually music (so gets rid of ringtones)
		String selection = MediaStore.Audio.Media.IS_MUSIC + " != 0";

		// Define our cursor
		Cursor cursor = getContentResolver().query(allsongsuri, null,
				selection, null, null);

		// Some fields
		String songName = "";
		String artistName = "";

		ArrayList<String> artist_names = new ArrayList<String>();
		JSONArray artists = new JSONArray();

		if (cursor != null) {
			if (cursor.moveToFirst()) {
				do {

					// Get the actual filepath
					String fullpath = cursor.getString(cursor
							.getColumnIndex(MediaStore.Audio.Media.DATA));

					// Make a metadata retriever
					MediaMetadataRetriever mmr = new MediaMetadataRetriever();
					try {
						// Set the filepath of the song
						mmr.setDataSource(fullpath);

						// Grab artist name
						artistName = mmr
								.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST);

						// Grab song name
						songName = mmr
								.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE);

						JSONObject tempSong = new JSONObject();

						if (!artist_names.contains(artistName)
								&& artistName != null && artistName != "") {

							artist_names.add(artistName);
							artists.put(artistName);

						}

					} catch (Exception e) {
						songName = "";

						// Something went wrong!
						Log.d("MetaData Finder", "illegal filepath");
					}

					if (songName != "" && songName != null) {
						// Just output the songname for now..
						// tv.append("\n" + artistName + " - " + songName);
					}

				} while (cursor.moveToNext());

			}

			cursor.close();

			JSONObject sentObject = new JSONObject();
			try {
				sentObject.put("artists", artists);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			sentLounge = sentObject;

		}

	}

	private void postJSON(JSONObject postData, String url) {

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {

					Toast.makeText(c, result, Toast.LENGTH_SHORT).show();

				};
			};
			asyncHttpPost.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	public void postGPS(JSONObject postData, String url) {

		// JSON object to hold the information, which is sent to the server

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {

					try {
						drawList(result);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();

					}

				}

			};
			asyncHttpPost.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

}
