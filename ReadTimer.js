/*
 * ReadTimer
 * Author: Forepoint
 * Version: 0.1b
 * Website: http://forepoint.co.uk
 * 
 * Highly inspired on the Information Architects Blog 
 * Remaining time functionality (http://ia.net/)
 *
 * Example: $( '#blog-post' ).ReadTimer();
 * 
 */
$.fn.ReadTimer = function( opts ) {

  /**
   * [settings which can be altered]
   * @type {Object}
   */
  var settings = $.extend( {
    
    'words_per_minute' : 210,
    'content_tags' : [ 'h1', 'h2','h3','h4','h5','h6', 'p' ],
    'include_images' : false,
    'output_selector' : '#read_timer'

  }, opts );

  /**
   * [CONSTANTS]
   * @type {Object}
   */
  var consts = {
    'total_time'      : 0,
    'remaining_time'  : 0,
    'progress' : 0,
    'output_text' : '',
    'media_height' : 0
  };

  /**
   * [methods]
   * @type {Object}
   */
  var methods = {

    /**
     * [init called on load]
     * @return {void}
     */
    init : function( current_ele ) {

      methods.on_load( current_ele );
      methods.on_scroll( current_ele );

    },
    /**
     * [on_load methods called on load and set stuff up]
     * @return {void}
     */
    on_load : function( current_ele ) {

      consts.total_time = new Time();
      consts.total_time.setTime( methods.total_time( current_ele ) );

      methods.get_media_height( current_ele );
      methods.update_text( consts.total_time );
      methods.attach_total_time_to_dom( current_ele );

      methods.output_text();

    },
    /**
     * [get_media_height description]
     * @return {void}
     */
    get_media_height : function( current_ele ){
      
      if( settings.include_images ) {

        current_ele.find( 'img' ).each( function(){
          consts.media_height += $( this ).height();
        });

      }

    },
    /**
     * [on_scroll update stuff on scroll]
     * @return {void}
     */
    on_scroll : function( current_ele ) {

      $( window ).scroll( function() {
        
        var scroll_offset = $( document ).scrollTop();

        consts.progress = ( scroll_offset ) / ( ( current_ele.height() + consts.media_height ) - scroll_offset );

        consts.remaining_time = new Time();
        consts.remaining_time.setTime( consts.total_time.raw_seconds * ( 1 - consts.progress ) );

        methods.update_text( consts.remaining_time );
        methods.attach_total_time_to_dom( current_ele );
        methods.attach_remaining_time_to_dom( current_ele );

        methods.output_text();

      } );

    },
    /**
     * [update_text update the nice output string for the user]
     * @return {void}
     */
    update_text : function( time_object ) {

      if( time_object.raw_seconds > 1 ) {
        
        consts.output_text = 'Estimated reading time ' + time_object.toString();

      } else if( consts.progress >= 1 ) {
        
        consts.output_text = 'Thanks for reading';

      } else if ( time_object.raw_seconds <= 1 ) {
        
        consts.output_text = 'Less than a minute';

      }

    },
    /**
     * [output_text output the text to the user in a nice format]
     * @return {void}
     */
    output_text : function() {

      if( $( settings.output_selector ).length > 0 ) {
        $( settings.output_selector ).html( consts.output_text );
      }

    },
    /**
     * [attach_total_time_to_dom attaches the raw remaining time in seconds to a data attr]
     * @return {void}
     */
    attach_total_time_to_dom : function( current_ele ) {
      current_ele.attr( 'data-total-time-raw', consts.total_time.raw_seconds );
    },
    /**
     * [attach_remaining_time_to_dom attaches the raw remaining time in seconds to a data attr]
     * @return {void}
     */
    attach_remaining_time_to_dom : function( current_ele ) {
      current_ele.attr( 'data-total-remaining-time-raw', consts.remaining_time.raw_seconds );
    },
    /**
     * [total_time calculate the total time to read the page]
     * @param  {jQuery} current_ele [The element that is attached]
     * @return {int} [Time in minutes to read the document]
     */
    total_time : function( current_ele ) {

      var total_time = 0;
      var body_copy = current_ele.find( settings.content_tags.join( ', ' ) );

      body_copy.each( function() {

        total_time += Math.round( 60 * $( this ).text().split( ' ' ).length / settings.words_per_minute );
      
      } );

      if( total_time == 0 ) { throw "Hey, add some content."; }

      return total_time; 

    }

  };
  /*
   * Time Object 
   */
  function Time() {
    
    this.minutes = 0;
    this.seconds = 0;
    this.raw_seconds = 0;

  }
  /**
   * [toString convert the numbers into a nicely formatted string that is human readable]
   * @return {String} [Formatted Time String]
   */
  Time.prototype.toString = function() {

    var m = ( parseInt( this.minutes ) < 10 ) ? '0' + this.minutes : this.minutes,
        s = ( parseInt( this.seconds ) < 10 ) ? '0' + this.seconds : this.seconds;

    return m + ':' + s;

  }
  /**
   * [setTime set the minutes and the seconds store for later use]
   * @param {void}
   */
  Time.prototype.setTime = function( seconds ) {
    
    var date = new Date( null );
    date.setSeconds( seconds );

    this.raw_seconds = seconds;

    this.minutes = date.getUTCMinutes();
    this.seconds = date.getUTCSeconds();

  }

  return $( this ).each( function() {
    
    methods.init( $( this ) );

  });

};