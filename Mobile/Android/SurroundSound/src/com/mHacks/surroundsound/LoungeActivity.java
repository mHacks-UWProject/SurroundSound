package com.mHacks.surroundsound;

import java.io.File;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.mHacks.surroundsound.models.QueueObject;
import com.mHacks.surroundsound.utils.QueueListAdapter;
import com.mHacks.surroundsound.web.AsyncHttpPost;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.utils.StorageUtils;

public class LoungeActivity extends Activity {

	private ArrayList<QueueObject> queuedSongs = new ArrayList<QueueObject>();

	private ImageLoader mImageLoader;

	private String mLoungeId;

	private Context c;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.lounge_activity);
		Bundle extras = getIntent().getExtras();
		c = this;

		initImageLoader();

		((TextView) findViewById(R.id.lounge_title)).setText(extras
				.getString("name"));

		mLoungeId = extras.getString("loungeId");

		JSONObject lounge = new JSONObject();
		try {
			lounge.put("id", mLoungeId);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		postJSON(lounge, "http://surroundsound.herokuapp.com/queryLounge");

	}

	private void postJSON(JSONObject postData, String url) {

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {

					createListview(result);

				};
			};
			asyncHttpPost.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	private void createListview(String result) {

		JSONArray jArray = null;
		try {
			jArray = new JSONArray(result);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		for (int i = 0; i < jArray.length(); i++) {

			JSONObject newObject = null;
			try {
				newObject = jArray.getJSONObject(i);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			QueueObject qObject = new QueueObject();

			try {
				qObject.setSongName(newObject.getString("song"));
			} catch (Exception e) {
				qObject.setSongName("Not Available");
			}

			try {
				qObject.setArtistName(newObject.getString("artist"));
			} catch (Exception e) {
				qObject.setArtistName("Not Available");
			}
			try {
				qObject.setImageURL(newObject.getString("img"));
			} catch (Exception e) {
				qObject.setImageURL("http://i43.tower.com/images/mm113753524/for-lack-better-name-deadmau5-cd-cover-art.jpg");
			}
			
			queuedSongs.add(qObject);

		}

		final QueueObject nowPlaying = queuedSongs.get(0);

		((TextView) findViewById(R.id.lounge_playing_artist))
				.setText(nowPlaying.getArtistName());
		((TextView) findViewById(R.id.lounge_playing_song)).setText(nowPlaying
				.getSongName());
		
	

		mImageLoader.displayImage(nowPlaying.getImageURL(),
				((ImageView) findViewById(R.id.lounge_main_image)));

		queuedSongs.remove(0);
		ListView lv = (ListView) findViewById(R.id.lounge_queue);

		QueueListAdapter adapter = new QueueListAdapter(this,
				R.layout.lounge_queue_object, queuedSongs, mImageLoader,
				mLoungeId);

		lv.setAdapter(adapter);

		lv.setItemsCanFocus(true);
		lv.setFocusable(false);
		lv.setFocusable(false);
		lv.setFocusableInTouchMode(false);
		Button up = (Button) findViewById(R.id.lounge_main_yes_button);
		Button down = (Button) findViewById(R.id.lounge_main_yes_button);

		OnClickListener upClick = new OnClickListener() {
			String direction;

			@Override
			public void onClick(View v) {
				if (nowPlaying.getScore() == 0 || nowPlaying.getScore() == -1) {
					nowPlaying.setScore(1);
					direction = "up";
				} else {
					nowPlaying.setScore(0);
					direction = "down";
				}

//				changeArrow(nowPlaying.getScore(), view.upView, view.downView,
//						nowPlaying.getArtistName(), direction);
			}
		};

		OnClickListener downClick = new OnClickListener() {
			String direction;

			@Override
			public void onClick(View v) {
				if (nowPlaying.getScore() == 0 || nowPlaying.getScore() == 1) {
					nowPlaying.setScore(-1);
					direction = "down";

				} else {
					nowPlaying.setScore(0);
					direction = "up";

				}

//				changeArrow(nowPlaying.getScore(), view.upView, view.downView,
//						nowPlaying.getArtistName(), direction);
			}
		};
		
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
}
