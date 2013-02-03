package com.mHacks.surroundsound;

import java.util.ArrayList;
import java.util.Arrays;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.mHacks.surroundsound.web.AsyncHttpPost;

public class TestActivity extends Activity {
	private Context c;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_test);
		getSongs();
		c = this;
		((Button) findViewById(R.id.button1))
				.setOnClickListener(new OnClickListener() {

					@Override
					public void onClick(View v) {
						Intent intent = new Intent(getApplicationContext(),
								LoungeListActivity.class);
						startActivity(intent);
					}
				});

	}

	public void getSongs() {
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

		// Just pop it up on a simple textview here.
		TextView tv = (TextView) findViewById(R.id.test);
		tv.setText("");

		ArrayList<String> artist_names = new ArrayList<String>();

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

			JSONArray mJSONArray = new JSONArray(Arrays.asList(artist_names));
			JSONObject sentObject = new JSONObject();
			try {
				sentObject.put("Artists", mJSONArray);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//Just show what the json you're sending is
			tv.append("\n" + sentObject.toString());
			
			postJSON(sentObject, "Http://null");
		}

	}

	private void postJSON(JSONObject postData, String url) {

		// JSON object to hold the information, which is sent to the server

//		try {
//
//			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
//				@Override
//				protected void onPostExecute(String result) {
//					Toast.makeText(c, result, Toast.LENGTH_LONG).show();
//
//				};
//			};
//			asyncHttpPost
//					.execute(url);
//
//		} catch (Exception e) {
//			// TODO: handle exception
//		}
	}
}
