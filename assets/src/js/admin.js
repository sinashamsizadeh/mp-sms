/**
 * Admin JS
 *
 * @author  AweCodebox
 * @package	Melipayamak SMS
 * @since	1.0.0
 */
'use strict';

var MeliPayamakSMS = (function ($) {

	return {
		
		/**
		 * Init.
		 *
		 * @since	1.0.0
		 */
		init: function () {

			this.load();
		},

		/**
		 * Load.
		 *
		 * @since	1.0.0
		 */
		load: function () {

			console.log('test');
		},

	}

})(jQuery);

jQuery(document).on('ready', function () {
	MeliPayamakSMS.init();
});