package com.mHacks.surroundsound;

import java.io.File;
import java.util.ArrayList;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;

import com.mHacks.surroundsound.models.QueueObject;
import com.mHacks.surroundsound.utils.QueueListAdapter;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.utils.StorageUtils;

public class LoungeActivity extends Activity{

	private ArrayList<QueueObject> x = new ArrayList<QueueObject>();

	private ImageLoader mImageLoader;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.lounge_activity);

		initImageLoader();
		
		createListview();
		  
		  
	}
	
	private void createListview() {
		ListView lv = (ListView) findViewById(R.id.lounge_queue);
		
		for (int i = 0; i < 10; i++) {
			x.add(new QueueObject());
			x.get(i).setSongName("song + #" + i);
			x.get(i).setArtistName("Arteest #" + i);
			x.get(i).setImageURL("http://i43.tower.com/images/mm113753524/for-lack-better-name-deadmau5-cd-cover-art.jpg");
		}
		
		QueueListAdapter adapter = new QueueListAdapter(this, R.layout.lounge_queue_object, x, mImageLoader);
		
		lv.setAdapter(adapter);
		
		lv.setItemsCanFocus(true);
		lv.setFocusable(false);
		lv.setFocusable(false);
		lv.setFocusableInTouchMode(false);
		
	}

	public void initImageLoader() {
		File cacheDir = StorageUtils.getCacheDirectory(this);
		  ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(this).build();
		  
		  DisplayImageOptions options = new DisplayImageOptions.Builder().showImageForEmptyUri(R.drawable.placeholder).build();
		  
	     ImageLoader.getInstance().init(config);

	     
	     mImageLoader = ImageLoader.getInstance();
	}
}
