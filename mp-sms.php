<?php
/**
 * Plugin Name: Melipayamak SMS
 * Plugin URI: https://www.awecodebox.com/
 * Description: It will send sms using meli payamak webservice.
 * Author: AweCodeBOX
 * Author URI: https://www.awecodebox.com/
 * Version: 1.0.0
 * Text Domain: mp-sms
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Melipayamak SMS
 */

namespace AweCodBoxMP;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'AweCodBoxMP\SMS' ) ) {

	final class SMS {

		/**
		 * Instance of this class.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    SMS
		 */
		public static $instance;

		/**
		 * The directory of the file.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $dir;

		/**
		 * The directory of the file.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $slug;

		/**
		 * The directory of the file.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $id;

		/**
		 * The directory of the file.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $url;

		/**
		 * The assets of the file.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $assets;

		/**
		 * The version of plugin.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var     string
		 */
		public static $version;

		/**
		 * Provides access to a single instance of a module using the singleton pattern.
		 *
		 * @since  1.0.0
		 * @return object
		 */
		public static function get_instance() {

			if ( self::$instance === null ) {

				self::$instance = new self();
			}

			return self::$instance;
		}
	
		/**
		 * Constructor.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function __construct() {

			$this->hooks();
			$this->definition();
			$this->load_dependencies();
		}
	
		/**
		 * Hooks.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function hooks() {

			add_action( 'plugins_loaded', [$this, 'load_textdomain'], 1 );
		}
	
		/**
		 * Definition.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function definition() {

			self::$dir		= plugin_dir_path( __FILE__ );
			self::$url		= plugin_dir_url( __FILE__ );
			self::$assets	= self::$url . 'assets/';
			self::$version	= '1.0.0';
			self::$slug		= 'mp-sms';
			self::$id		= 'mp_sms';
		}
	
		/**
		 * Load the dependencies.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function load_dependencies() {

			/**
			 * Melipayamak
			 */
			require self::$dir . '/vendor/autoload.php';

			/**
			 * Admin
			 */
			require self::$dir . '/classes/admin.php';

			/**
			 * Enqueue
			 */
			require self::$dir . '/classes/enqueue.php';

			/**
			 * Ajax
			 */
			require self::$dir . '/classes/ajax.php';

		}
		
		/**
		 * Load the textdomain of the plugin.
		 *
		 * @since   1.0.0
		 */
		public function load_textdomain() {

			load_plugin_textdomain( self::$slug, false, basename( dirname( __FILE__ ) ) . '/languages' );
		}
	
	}

	SMS::get_instance();
}