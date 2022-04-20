<?php
/**
 * API
 * 
 * @package Melipayamak API
 */

namespace AweCodBoxMP\MP;

use AweCodBoxMP\SMS;
use Melipayamak\MelipayamakApi;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'AweCodBoxMP\MP\API' ) ) {

	class API extends \WP_REST_Controller {

		/**
		 * Instance of this class.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    API
		 */
		public static $instance;

		/**
		 * Username of melypayamak.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    API
		 */
		public static $username;

		/**
		 * password of melypayamak.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    API
		 */
		public static $password;

		/**
		 * patterns of melypayamak.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    API
		 */
		public static $patterns;

		/**
		 * options of melypayamak.
		 *
		 * @since  1.0.0
		 * @access public
		 * @var    API
		 */
		public static $options;
		
		/**
		 * auth.
		 *
		 * @since   1.0.0
		 * @access  private
		 */
		private static $auth;
		
		/**
		 * auth.
		 *
		 * @since   1.0.0
		 * @access  private
		 */
		private static $send;
	
		/**
		 * mb_namespace of this cwb routes.
		 
		 * @since   1.0.0
		 * @access  private
		 */
		private static $mb_namespace;

		/**
		 * Provides access to a single instance of a module using the singleton pattern.
		 *
		 * @since   1.0.0
		 * @return  object
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

			$this->definition();
			$this->hooks();
		}
	
		/**
		 * Hooks.
		 *
		 * @since 1.0.0
		 * @access private
		 */
		private function hooks() {
	
			add_action( 'rest_api_init', [ $this,'setup_routs' ] );
		}
	
		/**
		 * Definition.
		 *
		 * @since  1.0.0
		 * @access private
		 */
		private function definition() {
			
			self::$mb_namespace	= SMS::$slug . '/v2';
			self::$auth			= 'auth';
			self::$send			= 'send';
			self::$options		= $this->GetOptions();
			self::$username		= isset ( self::$options['username'] ) ? self::$options['username'] : '';
			self::$password		= isset ( self::$options['password'] ) ? self::$options['password'] : '';
			self::$patterns		= isset ( self::$options['patterns'] ) ? self::$options['patterns'] : '';
		}

		/**
		 * Check if the user has permission.
		 *
		 * @since 1.0.0
		 */
		public function user_has_permission( $request  ) {

			$email = $request['email'];

			$user = get_user_by_email( $email );
			
			return true;
		}
	
		/**
		 * Check if a given request has access to update options.
		 *
		 * @since 1.0.0
		 */
		public function update_item_permissions_check( $request ) {
			
			return true;
		}
	
		
		/**
		 * create route response.
		 *
		 * @since 1.0.0
		 * @access private
		 */
		public function create_response( $message, $responseCode ) {

			return new \WP_REST_Response( $message, $responseCode );
		}
	
	
		
		/**
		 * setup routes.
		 *
		 * @since 1.0.0
		 * @access private
		 */
		public function setup_routs() {
	
			register_rest_route( self::$mb_namespace , '/' . self::$auth , [
				'methods'				=> \WP_REST_Server::EDITABLE,
				'callback'				=> [$this, 'Auth'],
				'permission_callback'	=> [$this, 'update_item_permissions_check'],
			] );

			register_rest_route( self::$mb_namespace , '/' . self::$send , [
				'methods'				=> \WP_REST_Server::EDITABLE,
				'callback'				=> [$this, 'Sned'],
				'permission_callback'	=> [$this, 'update_item_permissions_check'],
			] );

		}

		/**
		 * Send sms.
		 *
		 * @since  1.0.0
		 * @access protected
		 */
		protected function GetOptions() {

			return json_decode( get_option( SMS::$id ), true );
		}

		/**
		 * Set option.
		 *
		 * @since  1.0.0
		 * @access protected
		 */
		protected function SetOption( $options ) {

			$plugin_options = self::$options;

			foreach ( $options as $key => $value ) {

				$plugin_options[$key] = $value;
			}

			$plugin_options = json_encode( $plugin_options );

			update_option( SMS::$id, $plugin_options );
		}

		/**
		 * Authentication.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function Auth( $request ) {

			$params		= $request->get_params();
			$response	= $this->GetPatterns( $params );

			return $this->create_response( $response , 200 );
		}

		/**
		 * Send SMS using the Dedicated numbers.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function Sned( $request ) {

			$params		= $request->get_params();
			$response	= $this->GetPatterns( $params );

			return $this->create_response( $response , 200 );
		}

		/**
		 * Manage Send SMS.
		 *
		 * @since  1.0.0
		 * @access public
		 * @Param attr
		 */
		public function WebService( $request ) {

			$params		= $request->get_params();
			$response	= $this->GetPatterns( $params );

			return $this->create_response( $response['message'] , $response['code'] );
		}

		/**
		 * Get Patterns.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetPatterns( $params ) {

			if ( ! isset( $params['username'] ) && ! isset( $params['password'] ) && ! isset( $params['nonce'] ) ) {

				return __( 'Access denied.', SMS::$slug );
			}

			$client = new \SoapClient( 'https://api.payamak-panel.com/post/SharedService.asmx?wsdl', ['encoding' => 'UTF-8'] );
	
			$data = [
				'username' => $params['username'],
				'password' => $params['password'],
			];

			$body = $client->GetSharedServiceBody( $data )->GetSharedServiceBodyResult;

			if ( isset( $body ) ) {
				
				$data['patterns'] = $body->ShareServiceBody;
				
				$this->SetOption( $data );

				return [
					'message'	=> __( 'Successfully contacted to Meli Payamak WebService', SMS::$slug ),
					'code'		=> 200,
				];

			} else {

				return [
					'message'	=> __( 'Failed to contact Meli Payamak, Please make sure username and password are correct', SMS::$slug ),
					'code'		=> 403,
				];
			}
			
			return [
				'message'	=> __( 'Something went wrong, Please try again', SMS::$slug ),
				'code'		=> 403,
			];
		}

		/**
		 * Send sms.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function SendByWebService() {

			$username	= '09121761087';
			$password	= 'Mamad@123';
			$bodyId		= '61237';
			$text		= 'سلام این تست میباشد';
			$api		= new \MelipayamakApi( $username, $password );
			$smsRest	= $api->sms();
			$to			= '09355012489';
			$response = $smsRest->sendByBaseNumber($text, $to, $bodyId);
		}

		/**
		 * Send sms.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function NoncePermissionsCheck() {

			return check_ajax_referer( SMS::$id, 'nonce' );

		}

	}

	API::get_instance();
}