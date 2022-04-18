<?php
/**
 * Enqueue
 * 
 * @package Melipayamak Enqueue
 */

namespace MPenqueue;

use AweCodBoxMP\SMS;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'AweCodBoxMP\Enqueue' ) ) {

	class Enqueue {

		/**
		 * Instance of this class.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    Enqueue
		 */
		public static $instance;

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
		}
	
		/**
		 * Hooks.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function hooks() {

            add_action( 'admin_enqueue_scripts', [$this, 'scripts'] );
		}

		/**
		 * Load Scripts.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		public function scripts() {

			global $pagenow;

			if ( is_admin() && $pagenow == 'admin.php' && isset( $_GET['page'] ) && $_GET['page'] == 'mp-sms' ) {

				wp_enqueue_script( SMS::$slug . 'admin', SMS::$assets . 'src/js/admin.js', ['jquery'], SMS::$version, true );
				wp_localize_script( SMS::$slug . 'admin', SMS::$id . '_localize', [
					'ajax' => [
						'url'      => admin_url( 'admin-ajax.php' ),
						'nonce'    => wp_create_nonce( SMS::$id ),
					]
				] );
			}
		}

	}

	Enqueue::get_instance();
}