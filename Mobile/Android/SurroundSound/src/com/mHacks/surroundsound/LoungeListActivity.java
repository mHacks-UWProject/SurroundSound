package com.mHacks.surroundsound;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.Toast;

import com.handmark.pulltorefresh.library.PullToRefreshBase;
import com.handmark.pulltorefresh.library.PullToRefreshBase.OnRefreshListener;
import com.handmark.pulltorefresh.library.PullToRefreshListView;
import com.mHacks.surroundsound.models.LoungeObject;
import com.mHacks.surroundsound.utils.CustomAdapter;
import com.mHacks.surroundsound.utils.MyLocationListener;
import com.mHacks.surroundsound.web.AsyncHttpPost;

public class LoungeListActivity extends Activity {

	public PullToRefreshListView pullToRefreshView;

	private Context c;
	
	private ArrayList<LoungeObject> x = new ArrayList<LoungeObject>();

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.lounglist_layout);
		c = this;

		setupGeoLoc();

		pullToRefreshView = (PullToRefreshListView) findViewById(R.id.listView1);

		for (int i = 0; i < 20; i++) {
			x.add(new LoungeObject());
			x.get(i).setLoungeName("Blah");
			x.get(i).setLoungePlaying("Das Playing");
			x.get(i).setLoungeLocked(false);
			x.get(i).setLoungeId("THS IS FAK ID");

		}
		

		testPushGeo();

		CustomAdapter adapter = new CustomAdapter(this,
				R.layout.loungelist_object, x);

		pullToRefreshView.getRefreshableView().setAdapter(adapter);
		
		pullToRefreshView.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int pos, long id) {
				Toast.makeText(c, x.get(pos).getLoungeId(), Toast.LENGTH_LONG).show();
				
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
						new GetDataTask().execute();
					}
				});

	}

	private void testPushGeo() {
		JSONObject geoLoc = new JSONObject();

		JSONArray longLat = new JSONArray();
		
		
		try {
			longLat.put("42.280681");
			longLat.put("-83.733818");

			geoLoc.put("geo", longLat);

			postGPS(geoLoc,
					"http://surroundsound.herokuapp.com/queryLounges");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
	}

	private void setupGeoLoc() {
		/* Use the LocationManager class to obtain GPS locations */
		LocationManager mlocManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

		LocationListener mlocListener = new MyLocationListener(this.getApplicationContext(), this);
		mlocManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0,
				mlocListener);
	}

	

	private class GetDataTask extends AsyncTask<Void, Void, String[]> {

		protected void onPostExecute(String[] result) {
			// Call onRefreshComplete when the list has been refreshed.
			pullToRefreshView.onRefreshComplete();
			super.onPostExecute(result);
		}

		@Override
		protected String[] doInBackground(Void... params) {
			// TODO Auto-generated method stub
			return null;
		}
	}


	public void postGPS(JSONObject postData, String url) {

		// JSON object to hold the information, which is sent to the server

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {
					Toast.makeText(c, result, Toast.LENGTH_LONG).show();

				};
			};
			asyncHttpPost.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}

}
