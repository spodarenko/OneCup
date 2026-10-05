<?php
/**
 * OneCup child theme bootstrap.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_enqueue_scripts',
	function () {
		$ver = wp_get_theme()->get( 'Version' );
		wp_enqueue_style( 'onecup-font', 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap', array(), null );
		wp_enqueue_style( 'onecup-tokens', get_stylesheet_directory_uri() . '/config/tokens.css', array(), $ver );
		wp_enqueue_style( 'onecup', get_stylesheet_uri(), array( 'hello-elementor', 'onecup-tokens' ), $ver );
	},
	20
);
