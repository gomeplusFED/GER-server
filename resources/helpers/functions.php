<?php

if (empty(function_exists('noFunc'))) {

    function noFunc($name)
    {
        return empty(function_exists($name));
    }

}

if (noFunc('noFile')) {

    function noFile($path)
    {
        return empty(file_exists($path));
    }

}

if (noFunc('app')) {

    function app($name = '')
    {
        if (empty($name)) {
            return $GLOBALS['CI'];
        }

        $model = '\\App\\Models\\' . $name;
        return new $model;
    }

}

if (noFunc('config')) {

    function config($key, $default = null)
    {
        return array_get(get_config(), $key, $default);
    }

}

if (noFunc('env')) {

    function env($key, $default = null)
    {
        return getenv($key) ?: $default;
    }

}

if (noFunc('lang')) {

    function lang($key, $lang = '')
    {
        $lang OR $lang = app()->session->language ?: config('language');
        list($index, $file) = explode('@', $key);
        app()->lang->load($file ?: APP_ENV, $lang, false, false);
        return app()->lang->line($index) ?: $index;
    }

}
