$(document).ready(function(){
	
	/**************
	CREATE FILTER
	**************/
	window.disc = new Discoverer();
	disc.addFilter("person","=","tom cruise");
	disc.addFilter("date","<","2013");
	disc.addSort("popularity","desc");
	disc.page = 1; 
	disc.discover(addMovies);
});

  /************
	Add Movies To Display;
  *************/
function addMovies(data){
	var totalMovies = data.length;
	var cont = $("body");
	cont.html("");
	var offset = 0;
	var i=0;
	while(i<totalMovies && i < data.length && offset < data.length){
		var movie = data[offset];
		if(movie && movie.poster_path){
			var title=undefined;
			if(!movie.poster_path)title = movie.title;
			movie.poster_path = (movie.poster_path?"http://movies.grabdata.tk/image.php?tmdb="+movie.poster_path:"http://www.directv.com/img/movies.jpg"); 
			var anc = $("<a/>");
			anc.attr("href","http://grabmovies.tk/movie/watch/"+ movie.id);
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
}
