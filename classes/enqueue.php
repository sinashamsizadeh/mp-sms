<?php
/**
 * Enqueue
 * 
 * @package Melipayamak Enqueue
 */

namespace MPenqueue;

use AweCodBoxMP\SMS;
use MPAdmin\Admin;

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

            add_action( 'admin_enqueue_scripts', [$this, 'scripts'], 99999 );
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

				wp_dequeue_style( 'forms' );

				wp_enqueue_style( SMS::$slug . 'admin', SMS::$url . 'admin/build/index.css', SMS::$version, true );
				wp_enqueue_script( SMS::$slug . 'admin', SMS::$url . 'admin/build/index.js', ['wp-element', 'wp-i18n'] , SMS::$version, true );

				$verified	= ! empty( Admin::get_instance()->GetOptions( SMS::$id )['username'] ) && ! empty( Admin::get_instance()->GetOptions( SMS::$id )['password'] ) && ! empty( Admin::get_instance()->GetOptions( SMS::$id )['patterns'] ) ? 'true' : 'false';
				$expandable = [
					'trusted' => false
				];

				wp_localize_script( SMS::$slug . 'admin', SMS::$id . '_localize', [
					'ajax' => [
						'url'			=> admin_url( 'admin-ajax.php' ),
						'nonce'			=> wp_create_nonce( SMS::$id ),
					],
					'prefix'		=>	SMS::$id,
					'text_domain'	=>	SMS::$slug,
					'api_url'		=>	get_home_url() . '/wp-json/mp-sms/v2/',
					'options'		=>	Admin::get_instance()->GetOptions( SMS::$id ),
					'verified'		=>	$verified,
					'admin_url'		=>	admin_url( 'admin.php?page=mp-sms' ),
					'purchase'		=>	'https://awecodebox.com/plugins/mp-sms/pricing/',
					'expandable'	=> apply_filters( SMS::$id . '_expandable', $expandable )
				] );
			}
		}

	}

	Enqueue::get_instance();
}