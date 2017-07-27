/**
 * @preserve Copyright (c) 2012, Northfield X Ltd
All rights reserved.

Modified BSD License

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function ($) {
    'use strict';

    var DEFAULT_VALUE = 360;

    var DEFAULT_SETTINGS = {
        seconds: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        height: null,
        width: null,
        elementID: null
    };

    // Internal constants
    var PIE_TIMER_INTERVAL = 40;

    var TIMER_CSS_CLASS = 'pie_timer';

    var PIE_TIMER_DATA_NAME = 'pie_timer';

    // Math constants
    var THREE_PI_BY_TWO = 3 * Math.PI / 2;

    var PI_BY_180 = Math.PI / 180;

    var PieTimer = function (jquery_object, settings, callback) {
        if (settings.width === null) {
            settings.width = jquery_object.width();
        }
        if (settings.height === null) {
            settings.height = jquery_object.height();
        }

        this.settings = settings;
        this.jquery_object = jquery_object;
        this.interval_id = null;
        this.current_value = DEFAULT_VALUE;
				this.initial_time = settings.initial_time;
				this.accrued_time = 0;
        this.callback = callback;
        this.is_paused = true;
				this.is_reversed = typeof settings.is_reversed != 'undefined' ? settings.is_reversed : false;
        this.jquery_object.html('<canvas class="' + TIMER_CSS_CLASS + '" width="' + settings.width + '" height="' + settings.height + '"></canvas>');
        this.canvas = this.jquery_object.children('.' + TIMER_CSS_CLASS)[0];
        this.pieSeconds = this.settings.seconds;
    };

    PieTimer.prototype = {
        start: function () {
            if (this.is_paused) {
                if (this.current_value <= 0) {
                    this.current_value = DEFAULT_VALUE;
                }
                this.interval_id = setInterval($.proxy(this.run_timer, this), PIE_TIMER_INTERVAL);
                this.is_paused = false;
            }
        },

        pause: function () {
            if (!this.is_paused) {
							this.accrued_time = (new Date() - this.initial_time);
                clearInterval(this.interval_id);
                this.is_paused = true;
            }
        },

        run_timer: function () {
            if (this.canvas.getContext) {
							this.elapsed_time = (new Date() - this.initial_time) / 1000;
							this.current_value = DEFAULT_VALUE * Math.max(0, this.settings.seconds - this.elapsed_time) / this.settings.seconds;

                if(this.settings.elementID){
                    var seconds = Math.ceil(this.current_value/DEFAULT_VALUE * this.settings.seconds);
                    if(this.pieSeconds !== seconds){
                        this.pieSeconds = seconds;
                        $('#'+this.settings.elementID).html(this.pieSeconds);
                    }
                }

                if (this.current_value <= 0) {
                    clearInterval(this.interval_id);

                    // This is a total hack to clear the canvas. It would be
                    // better to fill the canvas with the background color
                    this.canvas.width = this.settings.width;

                    if ($.isFunction(this.callback)) {
                        this.callback.call();
                    }
                    this.is_paused = true;

                } else {
                    // This is a total hack to clear the canvas. It would be
                    // better to fill the canvas with the background color
                    this.canvas.width = this.settings.width;

                    var ctx = this.canvas.getContext('2d');

                    var canvas_size = [this.canvas.width, this.canvas.height];
                    var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
                    var center = [canvas_size[0] / 2, canvas_size[1] / 2];
										var isReversed = this.is_reversed;

                    ctx.beginPath();
                    ctx.moveTo(center[0], center[1]);
                    var start = THREE_PI_BY_TWO;
                    ctx.arc(
                        center[0],
                        center[1],
                        radius,
												isReversed
														? start - (360 - this.current_value) * PI_BY_180
														: start - this.current_value * PI_BY_180,
												start,
												isReversed
                    );

                    ctx.closePath();
                    ctx.fillStyle = this.settings.color;
                    ctx.fill();

                }
            }
        }
    };

    var create_timer = function (options, callback) {
        var settings = $.extend({}, DEFAULT_SETTINGS, options);

        return this.each(function () {
            var $element = $(this);
            var pie_timer = new PieTimer($element, settings, callback);
            $element.data(PIE_TIMER_DATA_NAME, pie_timer);
        });
    };

    var call_timer_method = function (method_name) {
        if (!(method_name in PieTimer.prototype)) {
            $.error('Method ' + method_name + ' does not exist on jQuery.pietimer');
        }
        var sliced_arguments = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $element = $(this);
            var pie_timer = $element.data(PIE_TIMER_DATA_NAME);

            if (!pie_timer) {
                // This element hasn't had pie timer constructed yet, so skip it
                return true;
            }
            pie_timer[method_name].apply(pie_timer, sliced_arguments);
        });
    };

    $.fn.pietimer = function (method) {

        if (typeof method === 'object' || ! method) {
            return create_timer.apply(this, arguments);
        } else {
            return call_timer_method.apply(this, arguments);
        }
    };

})(jQuery);
