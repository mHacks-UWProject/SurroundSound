package com.mHacks.surroundsound.utils;

import java.util.ArrayList;

import com.mHacks.surroundsound.R;
import com.mHacks.surroundsound.R.id;
import com.mHacks.surroundsound.R.layout;
import com.mHacks.surroundsound.models.LoungeObject;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

public class CustomAdapter extends ArrayAdapter<LoungeObject> {
		private final Activity activity;
		private final ArrayList<LoungeObject> loungeObjects;

		public CustomAdapter(Activity activity, int layoutId,
				ArrayList<LoungeObject> loungeObjects) {
			super(activity, layoutId, loungeObjects);
			this.activity = activity;
			this.loungeObjects = loungeObjects;

		}

		// Listview optimizations!!!

		// Note: Add lazylist loader if there are images.
		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View rowView = convertView;
			ViewHolder view;

			if (rowView == null) {
				// Get a new instance of the row layout view
				LayoutInflater inflater = activity.getLayoutInflater();
				rowView = inflater.inflate(R.layout.loungelist_object, null);

				// Hold the view objects in an object, that way the don't need
				// to be found again."
				view = new ViewHolder();
				view.lounge_name = (TextView) rowView
						.findViewById(R.id.loungeobject_title);
				view.lounge_playing = (TextView) rowView
						.findViewById(R.id.longelist_playing);
				view.lounge_icon = (ImageView) rowView
						.findViewById(R.id.loungeobject_lockedicon);

				rowView.setTag(view);
			} else {
				view = (ViewHolder) rowView.getTag();
			}

			/** Set data to your Views. */
			LoungeObject item = loungeObjects.get(position);
			view.lounge_name.setText(item.getLoungeName());
			view.lounge_playing.setText(item.getLoungePlaying());
			if (item.isLoungeLocked()) {
				view.lounge_icon.setVisibility(View.GONE);
			} else {
				view.lounge_icon.setVisibility(View.VISIBLE);
			}

			return rowView;
		}

		// Here is the viewholder..
		protected class ViewHolder {
			protected TextView lounge_name;
			protected TextView lounge_playing;
			protected ImageView lounge_icon;
		}

	}