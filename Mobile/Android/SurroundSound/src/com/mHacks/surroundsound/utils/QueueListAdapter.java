package com.mHacks.surroundsound.utils;

import java.util.ArrayList;

import com.mHacks.surroundsound.R;
import com.mHacks.surroundsound.R.id;
import com.mHacks.surroundsound.R.layout;
import com.mHacks.surroundsound.models.QueueObject;
import com.nostra13.universalimageloader.core.ImageLoader;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;



public class QueueListAdapter extends ArrayAdapter<QueueObject> {
		private final Activity activity;
		private  ArrayList<QueueObject> queueObjects;
		private ImageLoader imageLoader = null;

		public QueueListAdapter(Activity activity, int layoutId,
				ArrayList<QueueObject> queueObjects, ImageLoader imageLoader) {
			super(activity, layoutId, queueObjects);
			this.activity = activity;
			this.queueObjects = queueObjects;
			this.imageLoader = imageLoader;

		}

		// Listview optimizations!!!

		// Note: LazyLoader has been added
		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View rowView = convertView;
			ViewHolder view;

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

				rowView.setTag(view);
			} else {
				view = (ViewHolder) rowView.getTag();
			}

			/** Set data to your Views. */
			QueueObject item = queueObjects.get(position);
			view.queue_item_song.setText(item.getSongName());
			view.queue_item_artist.setText(item.getArtistName());
			imageLoader.displayImage(item.getImageURL(),view.queue_icon);

			return rowView;
		}

		// Here is the viewholder..
		protected class ViewHolder {
			protected TextView queue_item_song;
			protected TextView queue_item_artist;
			protected ImageView queue_icon;
		}

	}