package com.mHacks.surroundsound;

import android.content.Context;
import android.content.Intent;


public final class CommonUtilities {

	static final String SERVER_URL = "http://surroundsound.herokuapp.com";

	/**
	 * Google API project id registered to use GCM.
	 */
	static final String SENDER_ID = "304882114815";

	/**
	 * Tag used on log messages.
	 */
	static final String TAG = "PebbleStock";

	/**
	 * Intent used to display a message in the screen.
	 */
	static final String DISPLAY_MESSAGE_ACTION = "com.pebble.Stocks.DISPLAY_MESSAGE";

	/**
	 * Intent's extra that contains the message to be displayed.
	 */
	static final String EXTRA_MESSAGE = "message";

	/**
	 * Notifies UI to display a message.
	 * <p>
	 * This method is defined in the common helper because it's used both by the
	 * UI and the background service.
	 * 
	 * @param context
	 *            application's context.
	 * @param message
	 *            message to be displayed.
	 */
	static void displayMessage(Context context, String message) {
		Intent intent = new Intent(DISPLAY_MESSAGE_ACTION);
		intent.putExtra("message", message);
		context.sendBroadcast(intent);
	}
}
