package com.mHacks.surroundsound.utils;

import org.json.JSONObject;

import com.mHacks.surroundsound.web.AsyncHttpPost;

import android.content.Context;

public class Utils {
	
	
	public static void postJSON(JSONObject postData, String url, Context c) {

		// JSON object to hold the information, which is sent to the server

		try {

			AsyncHttpPost asyncHttpPost = new AsyncHttpPost(postData) {
				@Override
				protected void onPostExecute(String result) {
					
				};
			};
			asyncHttpPost
					.execute(url);

		} catch (Exception e) {
			// TODO: handle exception
		}
	}
	
	
}
