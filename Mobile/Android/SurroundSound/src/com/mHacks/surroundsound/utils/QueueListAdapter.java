package com.mHacks.surroundsound.utils;

import java.util.ArrayList;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.mHacks.surroundsound.R;
import com.mHacks.surroundsound.models.QueueObject;
import com.mHacks.surroundsound.web.AsyncHttpPost;
import com.nostra13.universalimageloader.core.ImageLoader;

public class QueueListAdapter extends ArrayAdapter<QueueObject> {
	private final Activity activity;
	private ArrayList<QueueObject> queueObjects;
	private ImageLoader imageLoader = null;
	private String mLoungeId;

	public QueueListAdapter(Activity activity, int layoutId,
			ArrayList<QueueObject> queueObjects, ImageLoader imageLoader,
			String loungeId) {
		super(activity, layoutId, queueObjects);
		this.activity = activity;
		this.queueObjects = queueObjects;
		this.imageLoader = imageLoader;
		this.mLoungeId = loungeId;
	}

	// Listview optimizations!!!

	// Note: LazyLoader has been added
	@Override
	public View getView(final int position, View convertView, ViewGroup parent) {
		View rowView = convertView;
		final ViewHolder view;

		if (rowView == null) {
			// Get a new instance of the row layout view
			LayoutInflater inflater = activity.getLayoutInflater();
			rowView = inflater.inflate(R.layout.lounge_queue_object, null);

			// Hold the view objects in an object, that way the don't need
			// to be found again."
			view = new ViewHolder();
			view.queue_item_song = (TextView) rowView
					.findViewById(R.id.queue_song_title);
			view.queue_item_artist = (TextView) rowView
					.findViewById(R.id.queue_artist_title);
			view.queue_icon = (ImageView) rowView
					.findViewById(R.id.queue_album_image);

			view.upView = (ImageView) rowView.findViewById(R.id.queue_up_arrow);
			view.downView = (ImageView) rowView
					.findViewById(R.id.queue_down_arrow);

			rowView.setTag(view);
		} else {
			view = (ViewHolder) rowView.getTag();

		}

		/** Set data to your Views. */
		final QueueObject item = queueObjects.get(position);

		OnClickListener upClick = new OnClickListener() {
			String direction;

			@Override
			public void onClick(View v) {
				if (item.getScore() == 0 || item.getScore() == -1) {
					item.setScore(1);
					direction = "up";
				} else {
					item.setScore(0);
					direction = "down";
				}

				changeArrow(item.getScore(), view.upView, view.downView,
						item.getArtistName(), direction);
			}
		};

		OnClickListener downClick = new OnClickListener() {
			String direction;

			@Override
			public void onClick(View v) {
				if (item.getScore() == 0 || item.getScore() == 1) {
					item.setScore(-1);
					direction = "down";

				} else {
					item.setScore(0);
					direction = "up";

				}

				changeArrow(item.getScore(), view.upView, view.downView,
						item.getArtistName(), direction);
			}
		};

		changeArrow(item.getScore(), view.upView, view.downView,
				item.getArtistName(), "none");
		view.upView.setOnClickListener(upClick);
		view.downView.setOnClickListener(downClick);

		view.queue_item_song.setText(item.getSongName());
		view.queue_item_artist.setText(item.getArtistName());

		// Load in the background because why not.
		String imageURL = item.getImageURL();

		if (imageURL.equals("") || imageURL == null) {
			view.queue_icon.setImageDrawable(activity.getResources().getDrawable(R.drawable.placeholder));
		} else {
			imageLoader.displayImage(item.getImageURL(), view.queue_icon);
		}

		return rowView;
	}

	// Here is the viewholder..
	protected class ViewHolder {
		protected TextView queue_item_song;
		protected TextView queue_item_artist;
		protected ImageView queue_icon;
		protected ImageView upView;
		protected ImageView downView;
	}

	public void changeArrow(int i, ImageView upImageView,
			ImageView downImageView, String artistName, String direction) {

		switch (i) {
		case 1:
			upImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowgood));
			downImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowdowngrey));
			break;
		case 0:
			upImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowupgrey));
			downImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowdowngrey));
			break;
		case -1:
			upImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowupgrey));
			downImageView.setImageDrawable(activity.getResources().getDrawable(
					R.drawable.arrowbad));
			break;

		}
		if (direction != "none") {
			JSONObject voteJSON = new JSONObject();
			try {
				voteJSON.put("vote", direction);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				voteJSON.put("id", mLoungeId);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				voteJSON.put("artist", artistName);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			postJSON(voteJSON, "http://surroundsound.herokuapp.com/vote");

		}
	}

	private void postJSON(JSONObject postData, String url) {

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {
					// nothing
				};
			};
			asyncHttpPost.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

}