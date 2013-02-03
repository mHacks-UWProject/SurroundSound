package com.mHacks.surroundsound.utils;

import java.util.ArrayList;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.mHacks.surroundsound.R;
import com.mHacks.surroundsound.models.LoungeObect;
import com.nostra13.universalimageloader.core.ImageLoader;

public class LoungeListAdapter extends ArrayAdapter<LoungeObect> {
	private final Activity activity;
	private final ArrayList<LoungeObect> loungeObjects;
	private ImageLoader mImageloader = null;

	public LoungeListAdapter(Activity activity, int layoutId,
			ArrayList<LoungeObect> loungeObjects, ImageLoader imageLoader) {
		super(activity, layoutId, loungeObjects);
		this.activity = activity;
		this.loungeObjects = loungeObjects;
		this.mImageloader = imageLoader;
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
				view.lounge_album = (ImageView) rowView.findViewById(R.id.loungeobject_album_cover);

				rowView.setTag(view);
			} else {
				view = (ViewHolder) rowView.getTag();
			}

			/** Set data to your Views. */
			LoungeObect item = loungeObjects.get(position);
			view.lounge_name.setText(item.getLoungeName());
			view.lounge_playing.setText(item.getLoungePlaying());
			if (!item.isLoungeLocked()) {
				view.lounge_icon.setVisibility(View.GONE);
			} else {
				view.lounge_icon.setVisibility(View.VISIBLE);
			}
			
			mImageloader.displayImage(item.getLoungeAlbumURL(), view.lounge_album);

			return rowView;
		}

	// Here is the viewholder..
	protected class ViewHolder {
		protected TextView lounge_name;
		protected TextView lounge_playing;
		protected ImageView lounge_icon;
		protected ImageView lounge_album;
	}

}