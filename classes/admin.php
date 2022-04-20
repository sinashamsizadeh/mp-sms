<?php
/**
 * Admin
 * 
 * @package Melipayamak Admin
 */

namespace MPAdmin;

use AweCodBoxMP\SMS;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'MPAdmin\Admin' ) ) {

	class Admin {

		/**
		 * Instance of this class.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    Admin
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

			$this->CreateOption();
			$this->hooks();
		}
	
		/**
		 * Hooks.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function hooks() {

            add_action( 'admin_menu', [$this, 'regist_page'] );
		}

		/**
		 * Setup Create Meli Payamak Option.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function CreateOption() {
			
			if ( ! get_option( SMS::$id ) ) {

				$options = json_encode ( [
					'username' => '',
					'password' => '',
					'patterns' => [],
				], true );

				update_option( SMS::$id, $options );
			}
		}
	
		/**
		 * Register Admin Page.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function regist_page() {

            add_menu_page(
				__( 'MeliPayamak SMS Web service', SMS::$slug ),
				__( 'SMS', SMS::$slug ),
				'manage_options',
				SMS::$slug,
				[ $this, 'page' ],
				'dashicons-email',
				90
			);

		}
	
		/**
		 * wp_sms Page.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function page() {

			echo '<div id="mp-sms-wrap"></div>';
		}

		/**
		 * Send sms.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetOptions() {

			return json_decode( get_option( SMS::$id ), true );
		}

	}

	Admin::get_instance();
}