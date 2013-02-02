package com.mHacks.surroundsound.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mHacks.surroundsound.LoungeListActivity;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;
import android.widget.Toast;

/* Class My Location Listener */
public class MyLocationListener implements LocationListener {

	private JSONObject mGeoLoc = new JSONObject();
	private Context c;
	private LoungeListActivity mLoungeListActivity;

	public MyLocationListener(Context c, LoungeListActivity loungeListActivity) {
		this.c = c;
		this.mLoungeListActivity = loungeListActivity;
	}

	@Override
	public void onLocationChanged(Location loc) {

		loc.getLatitude();
		loc.getLongitude();

		JSONObject geoLoc = new JSONObject();

		JSONArray longLat = new JSONArray();

		try {
			longLat.put(loc.getLongitude());
			longLat.put(loc.getLatitude());

			geoLoc.put("geo", longLat);

			this.setGeoLoc(geoLoc);
			mLoungeListActivity.postGPS(mGeoLoc, "http://surroundsound.herokuapp.com/queryLounges");


		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onProviderDisabled(String provider) {
		Toast.makeText(c.getApplicationContext(), "Gps Disabled",
				Toast.LENGTH_SHORT).show();
	}

	@Override
	public void onProviderEnabled(String provider) {
		Toast.makeText(c.getApplicationContext(), "Gps Enabled",
				Toast.LENGTH_SHORT).show();

	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {

	}

	public JSONObject getGeoLoc() {
		return mGeoLoc;
	}

	public void setGeoLoc(JSONObject geoLoc) {
		this.mGeoLoc = geoLoc;
	}
}