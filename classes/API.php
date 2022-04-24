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
		 * @access  protected
		 */
		protected static $auth;
		
		/**
		 * credits.
		 *
		 * @since   1.0.0
		 * @access  protected
		 */
		protected static $credits;
		
		/**
		 * send.
		 *
		 * @since   1.0.0
		 * @access  protected
		 */
		protected static $send;
	
		/**
		 * mb_namespace of this cwb routes.
		 
		 * @since   1.0.0
		 * @access  protected
		 */
		protected static $mb_namespace;

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
		 * @access protected
		 */
		protected function hooks() {
	
			add_action( 'rest_api_init', [ $this,'SetupRouts' ] );
		}
	
		/**
		 * Definition.
		 *
		 * @since  1.0.0
		 * @access protected
		 */
		protected function definition() {
			
			self::$mb_namespace	= SMS::$slug . '/v2';
			self::$auth			= 'auth';
			self::$credits		= 'credits';
			self::$send			= 'custom_users';
			self::$options		= $this->GetOptions();
			self::$username		= isset ( self::$options['username'] ) ? self::$options['username'] : '';
			self::$password		= isset ( self::$options['password'] ) ? self::$options['password'] : '';
			self::$patterns		= isset ( self::$options['patterns'] ) ? self::$options['patterns'] : '';
		}

		/**
		 * setup routes.
		 *
		 * @since 1.0.0
		 * @access public
		 */
		public function SetupRouts() {
	
			register_rest_route( self::$mb_namespace , '/' . self::$auth , [
				'methods'				=> \WP_REST_Server::EDITABLE,
				'callback'				=> [$this, 'Auth'],
				'permission_callback'	=> [$this, 'update_item_permissions_check'],
			] );

			register_rest_route( self::$mb_namespace , '/' . self::$credits , [
				'methods'				=> \WP_REST_Server::EDITABLE,
				'callback'				=> [$this, 'Credits'],
				'permission_callback'	=> [$this, 'update_item_permissions_check'],
			] );

			register_rest_route( self::$mb_namespace , '/' . self::$send , [
				'methods'				=> \WP_REST_Server::EDITABLE,
				'callback'				=> [$this, 'Send'],
				'permission_callback'	=> [$this, 'update_item_permissions_check'],
			] );

		}

		/**
		 * Check if the user has permission.
		 *
		 * @since 1.0.0
		 * @access public
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
		 * @access public
		 */
		public function update_item_permissions_check( $request ) {
			
			return true;
		}
	
		
		/**
		 * create route response.
		 *
		 * @since 1.0.0
		 * @access protected
		 */
		protected function create_response( $message, $responseCode ) {

			return new \WP_REST_Response( $message, $responseCode );
		}

		/**
		 * Get Plugin Options.
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
		public function Send( $request ) {

			$params	= $request->get_params();

			if ( isset( $params['numbers_type'] ) && $params['numbers_type'] == 'custom_users' ) {

				if ( isset( $params['custom_users'] ) ) {

					$multi_numbers = strpos( $params['custom_users'], ',' );

					if ( $multi_numbers ) {

						$numbers = sanitize_text_field( $params['custom_users'] );
						$numbers = explode( ',', $numbers );
						
					} else {

						$numbers = sanitize_text_field( $params['custom_users'] );
					}

					if ( isset( $params['sms_content'] ) ) {

						$content = sanitize_text_field( $params['sms_content'] );
					}

				}

			}

			$api		= new MelipayamakApi( self::$username, self::$password );
			$sms		= $api->sms( 'soap' );
			$to			= $numbers;
			$from		= $this->GetNumbers()[0]['Number'];
			$text		= $content;
			$isFlash	= false;

			$response			= $sms->send( $to, $from, $text, $isFlash );
			$response->numbers	= $numbers;

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
		 * Credits.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function Credits( $params ) {

			if ( empty( self::$options['username'] ) && empty( self::$options['password'] ) ) {

				return __( 'Access denied.', SMS::$slug );
			}

			$credits = $this->GetCredits();
			
			if ( isset( $credits ) ) {
				
				return [
					'message'	=> [
						'credits'		=> round( $credits['Value'] ),
						'mtncredits'	=> $this->GetIrancellPrice()['Value'],
						'mcicredits'	=> $this->GetHamraheAvalPrice()['Value'],
					],
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
		 * GET Hamrahe Aval SMS Price.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetHamraheAvalPrice() {

			if ( self::$options['username'] && self::$options['password'] ) {

				$data = [
					'username'		=> self::$options['username'],
					'password'		=> self::$options['password'],
					'irancellCount'	=> '0',
					'mtnCount'		=> '1',
					'from'			=> $this->GetNumbers()[0]['Number'],
					'text'			=> 'شششششش'
				];
	
				$post_data	= http_build_query( $data );
				$handle		= curl_init( 'https://rest.payamak-panel.com/api/SendSMS/GetBasePrice' );
				
				curl_setopt( $handle, CURLOPT_HTTPHEADER, [
					'content-type' => 'application/x-www-form-urlencoded'
				] );
				
				curl_setopt( $handle, CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $handle, CURLOPT_SSL_VERIFYHOST, false );
				curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, false );
				curl_setopt( $handle, CURLOPT_POST, true );
				curl_setopt( $handle, CURLOPT_POSTFIELDS, $post_data );
	
				$response = curl_exec( $handle );
	
				return json_decode( $response, true );
			}
			
			return false;
		}
		
		/**
		 * GET MTN Irancell SMS Price.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetIrancellPrice() {

			if ( self::$options['username'] && self::$options['password'] ) {

				$data = [
					'username'		=> self::$options['username'],
					'password'		=> self::$options['password'],
					'irancellCount'	=> '1',
					'mtnCount'		=> '0',
					'from'			=> $this->GetNumbers()[0]['Number'],
					'text'			=> 'شششششش'
				];
	
				$post_data	= http_build_query( $data );
				$handle		= curl_init( 'https://rest.payamak-panel.com/api/SendSMS/GetBasePrice' );
				
				curl_setopt( $handle, CURLOPT_HTTPHEADER, [
					'content-type' => 'application/x-www-form-urlencoded'
				] );
				
				curl_setopt( $handle, CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $handle, CURLOPT_SSL_VERIFYHOST, false );
				curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, false );
				curl_setopt( $handle, CURLOPT_POST, true );
				curl_setopt( $handle, CURLOPT_POSTFIELDS, $post_data );
	
				$response = curl_exec( $handle );
	
	
				return json_decode( $response, true );
			}
			
			return false;
		}

		/**
		 * Get Numbers.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetNumbers() {

			$api = new MelipayamakApi( self::$options['username'], self::$options['password'] );
			$sms = $api->sms();
			$result = json_decode( $sms->getNumbers(), true );

			return $result['Data'];
		}

		/**
		 * Get Numbers.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetCredits() {

			$data = [
				'username' => self::$options['username'],
				'password' => self::$options['password']
			];

			$post_data	= http_build_query( $data );
			$handle		= curl_init( 'https://rest.payamak-panel.com/api/SendSMS/GetCredit' );

			curl_setopt( $handle, CURLOPT_HTTPHEADER, [
				'content-type' => 'application/x-www-form-urlencoded'
			]);

			curl_setopt( $handle, CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $handle, CURLOPT_SSL_VERIFYHOST, false );
			curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, false );
			curl_setopt( $handle, CURLOPT_POST, true );
			curl_setopt( $handle, CURLOPT_POSTFIELDS, $post_data );
			$response = curl_exec( $handle );

			return json_decode( $response, true );
		}

		/**
		 * Get Users.
		 *
		 * @since  1.0.0
		 * @access public
		 */
		public function GetUsers( $request ) {

			$params		= $request->get_params();
			$response	= [];
			
			$users = get_users();
			
			foreach( $users	 as $key => $user ) {

				$response[] = $user->data->ID;
			}

			return $this->create_response( $response , 200 );
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