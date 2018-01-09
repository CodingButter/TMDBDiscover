# SimpleDiscovery

Simple Discover is a stand alone javscript library that helps quickly interface with [THE MOVIE DATABASE'S](http://tmdb.org) [DISCOVER API](https://www.themoviedb.org/documentation/api/discover)

It is very simple to implement and use.
### Version
0.1

### HOW TO

Setup is simple

just include the js file
```sh
<script data-tmdbkey="[YOUR_API_KEY]" src="js/simplediscover.js"></script>
```
Then create a new simpleDiscover
```sh
var dis = new simpleDiscover();
```
Next add a filter. The first perameter is what you'd like to filter by. The second is how youd like to compare in this case we will use equal since we are searching for a person.
```sh
dis.addFilter("person","=","Tom Cruise");
```
Then you can add a sort to your discovery
```sh
dis.addSort("popularity","desc");
```
Now you can select which page you'd like to return the results from.
```sh
dis.page = 1;
```
Once you have configured the discover then you can now discover your results passing in a callback function so you can 
handle the data however you'd like
```sh
dis.discover(function(data){
    console.log(data.results[0].poster_path);
});
```

Here is some example code that uses jQuery and the simpleDiscover
```sh
$(document).ready(function(){
	
	/**************
	CREATE FILTER
	**************/
	window.disc = new Discoverer();
	disc.addFilter("person","=","kevin spacey")
	disc.addFilter("date","<","2013");
	disc.addFilter("date",">","2000");
	disc.addSort("popularity","desc");
	disc.discover(addMovies);

});

  /************
	Add Movies To Display;
  *************/
function addMovies(data){
	var config = data.config;
	var results = data.results;
	var totalMovies = results.length;
	var cont = $("body");
	//cont.html("");
	var offset = 0;
	var i=0;
	while(i<totalMovies && i < results.length && offset < results.length){
		var movie = results[offset];
		if(movie && movie.poster_path){
			var title=undefined;
			if(!movie.poster_path)title = movie.title;
			movie.poster_path = (movie.poster_path?config.images.base_url+config.images.poster_sizes[config.images.poster_sizes.length-1]+movie.poster_path:"http://www.directv.com/img/movies.jpg"); 
			var anc = $("<a/>");
			anc.attr("href","https://www.themoviedb.org/movie/"+ movie.id);
			anc.addClass("poster");
			var poster = $("<img/>");
			poster.class="poster";
			poster.attr("src",movie.poster_path);
			poster.addClass("island");
			anc.append(poster);
			if(title)anc.append("<p class='movie_title'>"+title+"</p>");
			cont.append(anc);
			i++;
		}
		offset++;
	}
	if(data.total_pages>disc.page){
		disc.page = disc.page+1;
		disc.discover(addMovies);
	}
}
```
