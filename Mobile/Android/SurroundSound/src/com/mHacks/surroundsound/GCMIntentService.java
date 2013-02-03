
package com.mHacks.surroundsound;

import static com.mHacks.surroundsound.CommonUtilities.displayMessage;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import com.google.android.gcm.GCMBaseIntentService;
import com.google.android.gcm.GCMRegistrar;

/**
 * IntentService responsible for handling GCM messages.
 */
public class GCMIntentService extends GCMBaseIntentService {
	
	//This is google's class with some modifications. Mainly, I removed all of the stupid messages that keep getting displayed.

	@SuppressWarnings("hiding")
	private static final String TAG = "GCMIntentService";

	public GCMIntentService() {
		super("304882114815");
	}

	@Override
	protected void onRegistered(Context context, String registrationId) {
		Log.i(TAG, "Device registered: regId = " + registrationId);
		// displayMessage(context, "yay");
		
		
		
		SharedPreferences prefs = PreferenceManager
				.getDefaultSharedPreferences(this);
		String genId = prefs.getString("genId", "");
		ServerUtilities.register(context, registrationId, genId);
	}

	@Override
	protected void onUnregistered(Context context, String registrationId) {
		Log.i(TAG, "Device unregistered");
		displayMessage(context, "unregistered");
		if (GCMRegistrar.isRegisteredOnServer(context)) {
			ServerUtilities.unregister(context, registrationId);
		} else {
			// This callback results from the call to unregister made on
			// ServerUtilities when the registration to the server failed.
			Log.i(TAG, "Ignoring unregister callback");
		}
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		Log.i(TAG, "Received message");
		String message;
		try {
			message = intent.getExtras().getString("message");
			//Send a message to update! GCM is stupid.
			if (message.contains("update")) {
				message = "update";
			} else {
				//
			}
		} catch (Exception e) {
			message = "nothing";
		}
		displayMessage(context, message);
		// notifies user

	}

	@Override
	protected void onDeletedMessages(Context context, int total) {
		Log.i(TAG, "Received deleted messages notification");
		String message = "Deleted message";
		displayMessage(context, message);
		// notifies user
		generateNotification(context, message);
	}

	@Override
	public void onError(Context context, String errorId) {
		Log.i(TAG, "Received error: " + errorId);
		displayMessage(context, "error" + errorId);
	}

	@Override
	protected boolean onRecoverableError(Context context, String errorId) {
		// log message
		Log.i(TAG, "Received recoverable error: " + errorId);
		displayMessage(context, "recoverable error" + errorId);
		return super.onRecoverableError(context, errorId);
	}

	/**
	 * Issues a notification to inform the user that server has sent a message.
	 */
	private static void generateNotification(Context context, String message) {
//		int icon = R.drawable.ic_launcher;
//		long when = System.currentTimeMillis();
//		NotificationManager notificationManager = (NotificationManager) context
//				.getSystemService(Context.NOTIFICATION_SERVICE);
//		Notification notification = new Notification(icon, message, when);
//		String title = context.getString(R.string.app_name);
//		Intent notificationIntent = new Intent(context, PebbleStockMain.class);
//		// set intent so it does not start a new activity
//		notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
//				| Intent.FLAG_ACTIVITY_SINGLE_TOP);
//		PendingIntent intent = PendingIntent.getActivity(context, 0,
//				notificationIntent, 0);
//		notification.setLatestEventInfo(context, title, message, intent);
//		notification.flags |= Notification.FLAG_AUTO_CANCEL;
//		notificationManager.notify(0, notification);
	}

}
