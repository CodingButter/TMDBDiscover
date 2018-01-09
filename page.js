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
