<template>
	<div class="container-fluid">
		<div class="row">
			<h1 class="text-center">Next To Go</h1>
		</div>
		<div id="" class="row">
			<div class="col-xs-12 text-center">
				<button :class="getButtonClass('all')" @click="changeFilterHld('all')">All</button>
				<button :class="getButtonClass('greyhounds')" @click="changeFilterHld('greyhounds')" title="Greyhounds"><i class="icon icon-greyhound"></i></button>
				<button :class="getButtonClass('thoroughbred')" @click="changeFilterHld('thoroughbred')" title="Thoroughbred"><i class="icon icon-thoroughbred"></i></button>
				<button :class="getButtonClass('harness')" @click="changeFilterHld('harness')" title="Harness"><i class="icon icon-harness"></i></button>

			</div>
		</div>
		<p class="error">{{ errorMessage }}</p>
		<div id="" class="row">
			<div class="col-xs-12 col-md-4 col-lg-2" v-for="race in currentRaces">
				<div class="panel panel-info">
					<div class="panel-heading">
						<p><b>{{ race.raceName }}</b></p>
					</div>
					<div class="panel-body">
						<p><b>Closes {{ countdown(race.raceStartTime) }}</b></p>
					</div>
					<div class="panel-footer text-center">
						{{ race.meeting.location }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	export default {
		props: [],
		data() {
			return {
				dataUrl: 'https://api.beta.tab.com.au/v1/tab-info-service/racing/next-to-go/races?jurisdiction=NSW',
				staticUrl: '/races-static?jurisdiction=NSW', 
				filter: 'all',
				races: [],
				currentRaces: [],
				timer: null,
				currentTime: new Date(),
				errorMessage: 'Live data',
			};
		},
		methods: {
			/*
			@brief: Fetch data from API server
			*/
			fetchData: function() {
				var _this = this;
	            var resource = this.$resource(this.dataUrl);
	            var fallback = this.$resource(this.staticUrl);
	            resource.get({}).then(res => {
	                // success callback
	                _this.races = res.body.races;
	                _this.sortRaces();
	                _this.filterCurrentRaces();
	                _this.timer = setTimeout(this.timeoutHandle, 1000);
	            }, res => {
	                // error callback
	                console.log('Error loading API - fallback to local static file');
	                fallback.get({}).then(res => {
	                    // success callback
	                    _this.races = res.body.races;
	                    _this.sortRaces();
	                    _this.filterCurrentRaces();
	                    _this.timer = setTimeout(this.timeoutHandle, 1000);
	                    _this.errorMessage = 'Error: Using localised data, disable Cross-Origin restrictions for live data'
	                    console.log('Loaded static file');
	                }, res => { console.log('Error loading static file'); 
	                });
	            });
			},
			/*
			@brief: Handler for timeout
			*/
			timeoutHandle: function() {
            	this.timer = setTimeout(this.timeoutHandle, 1000);
            	this.filterCurrentRaces();
            	this.currentTime = new Date();
			},
			/*
			@brief: Sort race by raceStartTime (asc)
			*/
			sortRaces: function() {
				this.races.sort(function(race, nextRace) {
					if (moment(race.raceStartTime).isBefore(nextRace.raceStartTime)) {
						return -1;
					}
					return 1;
				})
			},
			/*
			@brief: Handler for change filter (race type)
			*/
			changeFilterHld: function(filter) {
				this.filter = filter;
			},
			/*
			@brief: Calculate time diff between raceStateTime and currentTime
			*/
			countdown: function(raceStartTime) {
				return moment(raceStartTime).from(this.currentTime);
			},
			/*
			@brief: Filter race by currentTime and filter (race type)
			*/
			filterCurrentRaces: function() {
				var races = [];
				switch (this.filter) {
					case 'greyhounds':
						races = this.races.filter(function(race) {
							return race.meeting.raceType == 'G';
						});
						break;
					case 'thoroughbred':
						races = this.races.filter(function(race) {
							return race.meeting.raceType == 'R';
						});
						break;
					case 'harness':
						races = this.races.filter(function(race) {
							return race.meeting.raceType == 'H';
						});
						break;
					default:
						races = this.races;
						break;
				}
				this.currentRaces = races.filter(race => moment(race.raceStartTime).isAfter(moment())).slice(0, 6);
			},
			/*
			@brief: Generate active button class
			*/
			getButtonClass: function(currentFilter) {
				var classes = 'btn btn-info';
				if (this.filter == currentFilter) {
					classes += ' active';
				}
				return classes;
			}
		},
		watch: {
			filter: function() {
				this.filterCurrentRaces();
			}
		},
		mounted() {
			console.log('App component is mounted');
			this.fetchData();
		},
		beforeDestroy() {
			clearTimeout(this.timer);
		},
		destroyed() {
			console.log('App component is destroyed');
		},
	}
</script>
