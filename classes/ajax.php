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

            // add_action( 'wp_ajax_mp_sms_auth', [$this, 'mp_sms_auth'] );
		}

		/**
		 * Send SMS.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function mp_sms_auth() {
			
			$username	= '09121761087';
			$password	= 'Mamad@123';
			$bodyId		= '61237';
			$text		= 'سلام این تست میباشد';
			// $api		= new \MelipayamakApi($username,$password);
			// $smsRest	= $api->sms();
			// $to			= '09355012489';
			// $response = $smsRest->sendByBaseNumber($text, $to, $bodyId);

			// $api			= new \MelipayamakApi( $username, $password );
			// $black_list	= $api->SharedService();
			// $result		= $black_list->getSharedServiceBody();

			var_dump($bodyId);

			wp_die();
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