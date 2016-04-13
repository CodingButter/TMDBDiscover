(function(factory)
{
	if (typeof define === "function" && define.amd) define(["descoverer"],
		factory);
	else factory();
})(function()
{
	var API_BASE = "http://api.themoviedb.org/3/";
	var API_KEY = document.querySelector("script[data-tmdbkey]").getAttribute(
		"data-tmdbkey");
	Discoverer = function()
	{
		var disc_url = API_BASE + "discover/movie";
		var properties = {};
		var prop_fix = {
			"genre": "with_genres",
			"people": "with_people",
			"person": "with_people",
			"date": "primary_release_date",
			"year": "primary_release_year"
		};
		var sort_fix = {
			"date": "release_date"
		};
		var conds = {
			"<": "lte",
			">": "gte"
		};
		var obj = {
			filters: [],
			rawfilters: [],
			sort: undefined,
			page: 1,
			addFilter: function(property, cond, value)
			{
				this.rawfilters.push(
				{
					prop: property,
					val: value,
					cond: cond
				});
			},
			loopFilters: function(_cb)
			{
				var This = this;
				if (this.rawfilters.length > 0)
				{
					var index = this.rawfilters.length - 1;
					this.buildFilters(this.rawfilters[index].prop, this.rawfilters[index].val,
						this.rawfilters[index].cond, function()
						{
							This.rawfilters.pop();
							This.loopFilters(_cb);
						});
				}
				else
				{
					_cb();
				};
			},
			buildFilters: function(property, value, cond, callback)
			{
				var This = this;
				if (property == "people" || property == "person")
				{
					value = this.addPeople(value.split(","), "", function(ids)
					{
						This.putFilter(property, ids.replace(/(^,)|(,$)/g, ""), cond);
						callback();
					});
				}
				else if (property == "genre")
				{
					getJSON(API_BASE + "genre/movie/list?callback=cb",
					{
						api_key: API_KEY
					}, function(gen)
					{
						gen = gen.genres;
						var genres = {};
						gen.forEach(function(g)
						{
							genres[g.name.toLowerCase()] = g.id;
						});
						properties.genre = genres;
						This.putFilter(property, value, cond);
						callback();
					});
				}
				else
				{
					This.putFilter(property, value, cond);
					callback();
				};
			},
			putFilter: function(property, value, cond)
			{
				this.filters.push(
				{
					prop: property,
					cond: (cond) ? conds[cond] : undefined,
					val: (properties[property] ? properties[property][value] : value)
				});
			},
			addSort: function(property, dir)
			{
				this.sort = (
				{
					prop: property,
					dir
				});
			},
			discover: function(callback)
			{
				var This = this;
				this.loopFilters(function()
				{
					var sends = This.buildSends();
					getJSON(disc_url, sends, function(data)
					{
						callback(data.results);
					});
				});
			},
			buildSends: function()
			{
				var tmp = {
					api_key: API_KEY,
					page: this.page
				};
				this.filters.forEach(function(f)
				{
					var cond = (f.cond != undefined) ? "." + f.cond : "";
					tmp[(prop_fix[f.prop] ? prop_fix[f.prop] : f.prop) + cond] = f.val;
				});
				if (this.sort) tmp['sort_by'] = (sort_fix[this.sort.prop] ? sort_fix[
					this.sort.prop] : (prop_fix[this.sort.prop] ? prop_fix[this.sort.prop] :
					this.sort.prop)) + "." + this.sort.dir;
				return tmp;
			},
			addPeople: function(value, found, callback)
			{
				var fnds = found.split(",");
				var index = value.length - fnds.length;
				var This = this;
				getJSON(API_BASE + "search/person?callback=cb",
				{
					api_key: API_KEY,
					query: value[index]
				}, function(data)
				{
					var id = parseInt(data.results[0].id);
					found += "," + id;
					found.trim(",");
					if (index > 0) This.addPeople(value, found, callback);
					else callback(found);
				}, "json");
			}
		};
		return obj;
	};

	function getJSON(_url, _data, _success, _fail, _datatype, _method)
	{
		var url = _url.url || _url || "";
		var data = _url.data || _data || "";
		var success = _url.success || _success || function(response) {};
		var fail = _url.fail || _fail || function(response) {};
		var datatype = _url.datatype || _datatype || "json";
		var method = _url.method || _method || "GET";
		url = url + serialize(data);
		var xmlhttp;
		if (window.XMLHttpRequest)
		{
			xmlhttp = new XMLHttpRequest();
		}
		else
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		};
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState == XMLHttpRequest.DONE)
			{
				if (xmlhttp.status == 200)
				{
					var response = xmlhttp.responseText;
					eval("response = " + response);

					function cb(dta)
					{
						return dta;
					};
					success(response);
				}
				else if (xmlhttp.status == 400)
				{
					fail("status:" + xmlhttp.status);
				}
				else
				{
					fail("status:" + xmlhttp.status)
				};
			};
		};
		xmlhttp.open(method, url, true);
		xmlhttp.send();

		function serialize(obj)
		{
			var q = url.indexOf("?") > -1;
			var str = (q) ? "" : "?";
			for (var key in obj)
			{
				if (str != "" || str != "?") str += "&";
				str += key + "=" + encodeURIComponent(obj[key]);
			};
			return str;
		};
	};
	return Discoverer;
});
