<?php
/**
 * Ajax
 * 
 * @package Melipayamak Ajax
 */
namespace MPAjax;

use AweCodBoxMP\SMS;
use Melipayamak\MelipayamakApi;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'AweCodBoxMP\Ajax' ) ) {

	class Ajax {

		/**
		 * Instance of this class.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    Ajax
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
            // add_action( 'init', [$this, 'send'] );

		}

		/**
		 * Send SMS.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function send() {

			try {
				$username = '09121761087';
				$password = 'Mamad@123';
				$api = new MelipayamakApi( $username,$password );
				$sms = $api->sms();
				$to = '09355012489';
				$from = '50004001761087';
				$text = 'تست وب سرویس ملی پیامک';
				$response = $sms->send( $to,$from,$text );
				$json = json_decode( $response );
				echo $json->Value; //RecId or Error Number 
			} catch( Exception $e ) {

				echo $e->getMessage();
			}
		}

		/**
		 * verify ajax.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function verify_ajax() {

			if ( ! current_user_can( 'manage_option' ) ) {
				return false;
			}
			
			check_ajax_referer( AweCodBoxMP\SMS::$id, 'nonce' );
		}

	}

	Ajax::get_instance();
}