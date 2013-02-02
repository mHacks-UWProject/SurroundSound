/* Copyright (c) 2007 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Provides functions for browsing and searching YouTube 
 * data API feeds, as a sample for how to interact with the JSON output
 * from the API. 
 * @author api.rboyd@google.com (Ryan Boyd)
 */

/**
 * provides namespacing for the YouTube Video Browser (ytvb)
 */
var ytvb = {};

/**
 * maximum number of results to return for list of videos
 * @type Number
 */
ytvb.MAX_RESULTS_LIST = 5;

/**
 * maximum number of results to return for related videos
 * @type Number
 */
ytvb.MAX_RESULTS_RELATED = 5;

/**
 * maximum number of results to return for videos by same
 * author as video currently being played.
 * @type Number
 */
ytvb.MAX_RESULTS_USER = 5;

/**
 * width of thumbnail images to display
 * @type Number
 */
ytvb.THUMBNAIL_WIDTH = 80;

/**
 * height of thumbnail images to display
 * @type Number
 */
ytvb.THUMBNAIL_HEIGHT = 72;

/**
 * navigation button id used to page to the previous page of
 * results in the list of videos
 * @type String
 */
ytvb.PREVIOUS_PAGE_BUTTON = 'previousPageButton';

/**
 * navigation button id used to page to the next page of
 * results in the list of videos
 * @type String
 */
ytvb.NEXT_PAGE_BUTTON = 'nextPageButton';

/**
 * table id used to display list of videos
 * @type String
 */
ytvb.VIDEO_LIST_TABLE = 'searchResultsVideoListTable';

/**
 * container div id used to hold table for list of videos
 * @type String
 */
ytvb.VIDEO_LIST_TABLE_CONTAINER_DIV = 'searchResultsVideoList';

/**
 * container div id used to hold the video player
 * @type String
 */
ytvb.VIDEO_PLAYER_DIV = 'videoPlayer';

/**
 * container div id used to hold the related video thumbnails
 * @type String
 */
ytvb.RELATED_VIDEOS_DIV = 'relatedVideos';

/**
 * container div id used to hold the video thumbnails for videos by the same
 * user as the video currently being played
 * @type String
 */
ytvb.USER_VIDEOS_DIV = 'userVideos';

/**
 * container div id used to hold the search box which displays when the page
 * first loads
 * @type String
 */
ytvb.MAIN_SEARCH_CONTAINER_DIV = 'mainSearchBox';

/** 
 * container div id used to hold the search box displayed at the top of
 * the browser after one search has already been performed
 * @type String
 */
ytvb.TOP_SEARCH_CONTAINER_DIV = 'searchBox';

/**
 * css class used for the paragraphs of video description information
 * @type String
 */
ytvb.VIDEO_DESCRIPTION_CSS_CLASS = 'videoDescription';

/**
 * css class used for the video list
 * @type String
 */
ytvb.VIDEO_LIST_CSS_CLASS = 'videoList';

/**
 * the rel value to look for in the atom:link collection of each video
 * in order to find the videos related to it by YouTube's logic
 * @type String
 */
ytvb.RELATED_VIDEOS_REL = 
    'http://gdata.youtube.com/schemas/2007#video.related';

/**
 * the MIME type used for flash videos, needed to find the appropriate
 * media:content link to use
 * @type String
 */
ytvb.FLASH_MIME_TYPE = 'application/x-shockwave-flash';

/**
 * the URL for the 'Top Rated' standard YouTube feed
 * @type String
 */
ytvb.STANDARD_FEED_URL_TOP_RATED = 
    'http://gdata.youtube.com/feeds/standardfeeds/top_rated';

/**
 * the URL for the 'Most Viewed' standard YouTube feed
 * @type String
 */
ytvb.STANDARD_FEED_URL_MOST_VIEWED = 
    'http://gdata.youtube.com/feeds/standardfeeds/most_viewed';

/**
 * the URL for the 'Recently Featured' standard YouTube feed
 * @type String
 */
ytvb.STANDARD_FEED_URL_RECENTLY_FEATURED = 
    'http://gdata.youtube.com/feeds/standardfeeds/recently_featured';

/** 
 * the URL to use for the standard YouTube video feed
 * @type String
 */
ytvb.VIDEO_FEED_URL = 
    'http://gdata.youtube.com/feeds/videos';

/**
 * map of URLs used for the different types of feeds to query
 * @type Object
 */
ytvb.QUERY_URL_MAP = {
  'top_rated' : ytvb.STANDARD_FEED_URL_TOP_RATED,
  'most_viewed' : ytvb.STANDARD_FEED_URL_MOST_VIEWED,
  'recently_featured' : ytvb.STANDARD_FEED_URL_RECENTLY_FEATURED,
  'all' : ytvb.VIDEO_FEED_URL
};

/**
 * the suffix to add onto the user profile feed to get the feed of
 * videos upload by the specified user
 * @type String
 */
ytvb.USER_VIDEOS_SUFFIX = '/uploads';

/**
 * the internal string used to represent the type of the feed
 * for which an index is a reference to - this is for references
 * to videos in the main list of videos displayed in the app
 * @type String
 */
ytvb.REFERRING_FEED_TYPE_MAIN = 'main';

/**
 * the internal string used to represent the type of the feed
 * for which an index is a reference to - this is for references
 * to videos in the list of related videos
 * @type String
 */
ytvb.REFERRING_FEED_TYPE_RELATED = 'related';

/**
 * the internal string used to represent the type of the feed
 * for which an index is a reference to - this is for references
 * to videos in the list of a user's videos
 * @type String
 */
ytvb.REFERRING_FEED_TYPE_USER = 'user';

/**
 * the page number to use for the next page navigation button
 * @type Number
 */
ytvb.nextPage = 2;

/**
 * the page number to use for the previous page navigation button
 * @type Number
 */
ytvb.previousPage = 0;

/** 
 * the last search term used to query - allows for the navigation
 * buttons to know what string query to perform when clicked
 * @type String
 */
ytvb.previousSearchTerm = '';

/**
 * the last query type used for querying - allows for the navigation
 * buttons to know what type of query to perform when clicked
 * @type String
 */
ytvb.previousQueryType = 'all';

/**
 * the JSON feed for the list of search results - stored for debugging 
 * purposes and to access data in the future based upon the index value
 * of the entry in the feed
 * @type {Object|Null}
 */
ytvb.jsonFeed_ = null;

/**
 * the JSON feed for the list of related video results - stored for debugging 
 * purposes and to access data in the future based upon the index value
 * of the entry in the feed
 * @type {Object|Null}
 */
ytvb.jsonFeedRelated_ = null;

/**
 * the JSON feed for the list of videos by the author of the currently playing
 * video - stored for debugging purposes and to access data in the future 
 *  based upon the index value of the entry in the feed
 * @type {Object|Null}
 */
ytvb.jsonFeedUser_ = null;

/**
 * Creates a script tag for retrieving a Google data JSON feed and and
 * adds it into the html head. 
 * @param {String} scriptSrc The URL for the script, assumed to already have at
 *     least one query parameter, so the '?' is not added to the URL
 * @param {String} scriptId The id to use for the script tag added to the head
 * @param {String} scriptCallback  The callback function to be used after the 
 *     JSON is retrieved.  The JSON is passed as the first argument to the 
 *     callback function.
 */
ytvb.appendScriptTag = function(scriptSrc, scriptId, scriptCallback) {
  // Remove any old existance of a script tag by the same name
  var oldScriptTag = document.getElementById(scriptId);
  if (oldScriptTag) {
    oldScriptTag.parentNode.removeChild(oldScriptTag);
  }
  // Create new script tag
  var script = document.createElement('script');
  script.setAttribute('src', 
      scriptSrc + '&alt=json-in-script&callback=' + scriptCallback);
  script.setAttribute('id', scriptId);
  script.setAttribute('type', 'text/javascript');
  // Append the script tag to the head to retrieve a JSON feed of videos
  // NOTE: This requires that a head tag already exists in the DOM at the
  // time this function is executed.
  document.getElementsByTagName('head')[0].appendChild(script);
};

/**
 * Given the JSON representing an entry, finds the atom:link element with the
 * specified 'rel' value.  Used to find the list of related feeds, comments, 
 * etc. for a particular video.
 * @param {Object} entry The evaluated JSON data representing an entry/video
 * @param {String} rel The rel value for which to find.
 * @return {String|Null} The URL (href) value in the found atom:link or null.
 */
ytvb.findLinkHref = function(entry, rel) {
  for (var i = 0, link; link = entry.link[i]; i++) {
    if (link.rel == rel) {
      return link.href;
    }
  }
  // a link with the specified rel was not found
  return null;
};

/**
 * Given the JSON representing an entry, finds the media:content element with
 * a 'type' attribute of the specified value.
 * @param {Object} entry The evaluated JSON data representing an entry/video
 * @param {String} type The MIME type to find amongst the 
 *     media:content elements
 * @return {String|Null} The URL (href) value int he found atom:link or null
 */
ytvb.findMediaContentHref = function(entry, type) {
  for (var i = 0, content; content = entry.media$group.media$content[i]; i++) {
    if (content.type == type) {
      return content.url;
    }
  }
  // a media:content element with the specified MIME type was not found
  return null;
};

/**
 * Retrieves a list of videos matching the provided criteria.  The list of
 * videos can be restricted to a particular standard feed or search criteria.
 *
 * Please see the following URL for more info on the different standard feeds
 * in the <a href="http://code.google.com/apis/youtube/reference.html#Feeds">
 * Reference Guide</a>
 * @param {String} queryType The type of query to be done - either 'all'
 *     for querying all videos, or the name of a standard feed.
 * @param {String} searchTerm The search term(s) to use for querying as the
 *     'vq' query parameter value
 * @param {Number} page The 1-based page of results to return.
 */
ytvb.listVideos = function(queryType, searchTerm, page) {
  ytvb.previousSearchTerm = searchTerm; 
  ytvb.previousQueryType = queryType; 
  var queryUrl = ytvb.QUERY_URL_MAP[queryType];
  if (queryUrl) {
    queryUrl += '?max-results=' + ytvb.MAX_RESULTS_LIST +
        '&start-index=' + (((page - 1) * ytvb.MAX_RESULTS_LIST) + 1);
    if (searchTerm != '') {
      queryUrl += '&vq=' + searchTerm;
    }
    ytvb.appendScriptTag(queryUrl, 
                         'searchResultsVideoListScript', 
                         'ytvb.listVideosCallback');
    ytvb.updateNavigation(page);
  } else {
    alert('Unknown feed type specified');
  }
};

/**
 * Callback function used for processing the results of ytvb.listVideos.
 * This function calls appendVideoData to list each of the videos in the UI
 * @param {Object} data The object obtained by evaluating the JSON text 
 *     returned by the YouTube data API
 */
ytvb.listVideosCallback = function(data) {
  // Stores the json data returned for later lookup by entry index value
  ytvb.jsonFeed_ = data.feed;
  var resultsTableContainer = document.getElementById(
      ytvb.VIDEO_LIST_TABLE_CONTAINER_DIV);

  // Deletes and re-adds the results table from container
  // NOTE: Any other elements added to the container will also be cleared
  while (resultsTableContainer.childNodes.length >= 1) {
    resultsTableContainer.removeChild(resultsTableContainer.firstChild);
  }

  var resultsTable = document.createElement('table');
  resultsTable.setAttribute('class', ytvb.VIDEO_LIST_CSS_CLASS);
  var tbody = document.createElement('tbody');
  resultsTable.setAttribute('width', '100%');
  resultsTableContainer.appendChild(resultsTable);

  // Loops through entries in the feed and calls appendVideoData for each
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    // The entry.yt$noembed property will exist if this YouTube video does
    // not support viewing in an embedded player on a third-party site.  
    // Exclude these videos from listing here.  A feature request has been
    // submitted for an additional query parameter to exclude these results
    // from the initial results feed.
    if (! entry.yt$noembed) {
      ytvb.appendVideoDataToTable(tbody, entry, i);
    }
  }
  resultsTable.appendChild(tbody);
};

/**
 * For the video at the specified index in the passed feed 
 * (stored as json in a ytvb-scoped property), find and show the related
 * videos.  The videos are added as thumbnail images to a div specified by
 * a constant and are presented in order of relevance (default ordering).
 * @param {Number} entryIndex The index of the entry in the JSON
 * @param {String} referringFeed The name for the referring feed - currently
 *     'related', 'user', or 'main'
 */
ytvb.showRelatedVideos = function(entryIndex, referringFeed) {
  var entry;
  try {
    if (referringFeed == ytvb.REFERRING_FEED_TYPE_RELATED) {
      entry = ytvb.jsonFeedRelated_.entry[entryIndex];
    } else if (referringFeed == ytvb.REFERRING_FEED_TYPE_USER) {
      entry = ytvb.jsonFeedUser_.entry[entryIndex];
    } else if (referringFeed == ytvb.REFERRING_FEED_TYPE_MAIN) {
      entry = ytvb.jsonFeed_.entry[entryIndex];
    } else {
      throw "Unknown type of referring feed.";
    }
    var relatedHref = ytvb.findLinkHref(entry, ytvb.RELATED_VIDEOS_REL);
    var relatedVideosDiv = document.getElementById(ytvb.RELATED_VIDEOS_DIV);
    while (relatedVideosDiv.childNodes.length >= 1) {
      relatedVideosDiv.removeChild(relatedVideosDiv.firstChild);
    }
    relatedVideosDiv.innerHTML = '<b>Related:</b><br />';
    if (relatedHref) {
      relatedHref += '?max-results=' + ytvb.MAX_RESULTS_RELATED;
      ytvb.appendScriptTag(relatedHref, 
          'showRelatedVideosScript', 
          'ytvb.showRelatedVideosCallback');
    }
  } catch (err) {
    alert(err);
  }
};

/**
 * For each related video in the JSON feed, add an thumbnail representing
 * that video to the div specified by a constant.
 * @param {Object} data The object obtained by evaluating the JSON text 
 *     returned by the YouTube data API
 */
ytvb.showRelatedVideosCallback = function(data) {
  var relatedVideosDiv = document.getElementById(ytvb.RELATED_VIDEOS_DIV);
  ytvb.jsonFeedRelated_ = data.feed;
  for (var i= 0, entry; entry = data.feed.entry[i]; i++) {
    relatedVideosJson = entry; 
    var img = document.createElement('img');
    img.setAttribute('src', entry.media$group.media$thumbnail[0].url);
    img.onclick = ytvb.generatePlayVideoLinkOnclick(entry.id.$t, i, 
        ytvb.REFERRING_FEED_TYPE_RELATED);
    img.setAttribute('width', ytvb.THUMBNAIL_WIDTH);
    img.setAttribute('height', ytvb.THUMBNAIL_HEIGHT);
    relatedVideosDiv.appendChild(img);
  }
};

/**
 * Finds the list of videos by the author whose profile URL is passed in.
 * These videos are added as thumbnail images to a div specified by a 
 * constant and are presented in the order of their ratings.
 * @param {String} userProfileUrl The URL pointing to the user's profile
 */
ytvb.showVideosByUser = function(userProfileUrl) {
  var userVideosDiv = document.getElementById(ytvb.USER_VIDEOS_DIV);
  while (userVideosDiv.childNodes.length >= 1) {
    userVideosDiv.removeChild(userVideosDiv.firstChild);
  }
  var queryUrl = userProfileUrl + ytvb.USER_VIDEOS_SUFFIX +
      '?max-results=' + ytvb.MAX_RESULTS_USER + 
      '&orderby=rating';
  userVideosDiv.innerHTML = '<br /><b>Top rated videos by user:</b><br />';
  ytvb.appendScriptTag(queryUrl, 
      'showVideosByUserScript', 
      'ytvb.showVideosByUserCallback');
};

/**
 * For each video entry in the provided JSON, add thumbnail images to
 * a div specified by a constant.
 * @param {Object} data The object obtained by evaluating the JSON text 
 *     returned by the YouTube data API
 */
ytvb.showVideosByUserCallback = function(data) {
  var userVideosDiv = document.getElementById(ytvb.USER_VIDEOS_DIV);
  ytvb.jsonFeedUser_ = data.feed;
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    userVideosJson = entry;
    var img = document.createElement('img');
    img.setAttribute('src', entry.media$group.media$thumbnail[0].url);
    img.onclick = ytvb.generatePlayVideoLinkOnclick(entry.id.$t, i, 
        ytvb.REFERRING_FEED_TYPE_USER);
    img.setAttribute('width', ytvb.THUMBNAIL_WIDTH);
    img.setAttribute('height', ytvb.THUMBNAIL_HEIGHT);
    userVideosDiv.appendChild(img);
  }
};

/**
 * Returns a function that can be added as an event handler for playing
 * a video upon the firing of the event.
 * @param {String} videoUrl The URL of the video to play
 * @param {Number} entryIndex The index of the entry in the referring feed
 * @param {String} referringFeed The referring feed
 * @return {Function} The video playing function
 */
ytvb.generatePlayVideoLinkOnclick = function(videoUrl, 
                                             entryIndex, 
                                             referringFeed) {
  return function() {
    ytvb.playVideo(entryIndex, referringFeed);
    return false;
  };
};

/**
 * Adds the HTML representation of the passed video entry to the 
 * table (tbody) element bassed.
 * @param {Node} tbody The table tbody node.  tbody is needed due to IE, as IE
 *     doesn't allow direct adding of rows to a table.
 * @param {Object} entry The JSON-encoded video entry to display in the table
 * @param {Number} entryIndex The index of the video in the JSON feed's
 *     entries.  This is needed to pass to the code which generates a video
 *     player when an onclick event is fired.
 */
ytvb.appendVideoDataToTable = function(tbody, entry, entryIndex) {
  var tr = document.createElement('tr');
  tr.onclick = ytvb.generatePlayVideoLinkOnclick(entry.id.$t, entryIndex, 
      ytvb.REFERRING_FEED_TYPE_MAIN);


  var thumbnailTd = document.createElement('td');
  thumbnailTd.setAttribute('width', '130');
  var thumbnailImage = document.createElement('img');
  thumbnailImage.setAttribute('src', 
      entry.media$group.media$thumbnail[0].url);
  thumbnailTd.appendChild(thumbnailImage);

  var metadataTd = document.createElement('td');
  metadataTd.setAttribute('width', '100%');
  var metadataLink = document.createElement('a');
  metadataLink.setAttribute('href', '#'); 
  metadataLink.innerHTML = entry.media$group.media$title.$t;
  var descPara = document.createElement('p');
  descPara.innerHTML = entry.media$group.media$description.$t;
  descPara.setAttribute('class', ytvb.VIDEO_DESCRIPTION_CSS_CLASS);
  metadataTd.appendChild(metadataLink);
  metadataTd.appendChild(descPara);

  tr.appendChild(thumbnailTd);
  tr.appendChild(metadataTd);
  tbody.appendChild(tr);
};

/**
 * Adds the object and embed tags to play the specified video
 * @param {Number} entryIndex The index of the video in the referring feed
 * @param {String} referringFeed Name of the referring feed
 */
ytvb.playVideo = function(entryIndex, referringFeed) {
  var entry;
  try {
    if (referringFeed == ytvb.REFERRING_FEED_TYPE_RELATED) {
      entry = ytvb.jsonFeedRelated_.entry[entryIndex];
    } else if (referringFeed == ytvb.REFERRING_FEED_TYPE_USER) {
      entry = ytvb.jsonFeedUser_.entry[entryIndex];
    } else if (referringFeed == ytvb.REFERRING_FEED_TYPE_MAIN) {
      entry = ytvb.jsonFeed_.entry[entryIndex];
    } else {
      throw "Unknown type of referring feed.";
    }
    var videoHref = ytvb.findMediaContentHref(entry, ytvb.FLASH_MIME_TYPE);
    var videoPlayerDiv = document.getElementById(ytvb.VIDEO_PLAYER_DIV);
    // Add standard YouTube video embed code, with standard height/width
    // values.  Enable autoplay of the video.
    var html = [];
    html.push('<b>');
    html.push(entry.media$group.media$title.$t);
    html.push('</b><br />');
    html.push('<object width="425" height="350"><param name="movie" value="');
    html.push(videoHref);
    html.push('&autoplay=1"></param><param name="wmode" value="transparent">');
    html.push('</param><embed src="');
    html.push(videoHref);
    html.push('&autoplay=1" type="application/x-shockwave-flash" ');
    html.push('wmode="transparent" width="425" height="350"></embed></object>');
    videoPlayerDiv.innerHTML = html.join('');
    ytvb.showRelatedVideos(entryIndex, referringFeed);
    if (entry.author && entry.author.length > 0) {
      ytvb.showVideosByUser(entry.author[0].uri.$t);
    }
  } catch (err) {
    alert(err);
  }
};

/**
 * Updates the variables used by the navigation buttons and the 'enabled' 
 * status of the buttons based upon the current page number passed in.
 * @param {Number} page The current page number
 */
ytvb.updateNavigation = function(page) {
  ytvb.nextPage = page + 1;
  ytvb.previousPage = page - 1;
  document.getElementById(ytvb.NEXT_PAGE_BUTTON).style.display = 'inline';
  document.getElementById(ytvb.PREVIOUS_PAGE_BUTTON).style.display = 'inline';
  if (ytvb.previousPage < 1) {
    document.getElementById(ytvb.PREVIOUS_PAGE_BUTTON).disabled = true;
  } else {
    document.getElementById(ytvb.PREVIOUS_PAGE_BUTTON).disabled = false;
  }
  document.getElementById(ytvb.NEXT_PAGE_BUTTON).disabled = false;
};

/**
 * Hides the main (large) search form and enables one that's in the
 * title bar of the application.  The main search form is only used
 * for the first load.  Subsequent searches should use the version in
 * the title bar.
 */
ytvb.hideMainSearch = function() {
  document.getElementById(ytvb.MAIN_SEARCH_CONTAINER_DIV).style.display = 
      'none';
  document.getElementById(ytvb.TOP_SEARCH_CONTAINER_DIV).style.display = 
      'inline';
};

/**
 * Method called when the query type has been changed.  Clears out the
 * value of the search term input box by default if one of the standard
 * feeds is selected.  This is to improve usability, as many of the standard
 * feeds may not include results for even fairly popular search terms.
 * @param {String} queryType The type of query being done - either 'all'
 *     for querying all videos, or the name of one of the standard feeds.
 * @param {Node} searchTermInputElement The HTML input element for the input
 *     element.
 */
ytvb.queryTypeChanged = function(queryType, searchTermInputElement) {
  if (queryType != 'all') {
    searchTermInputElement.value = '';
  }
};
