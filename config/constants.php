<?php

use App\Services\Event;

// 引入 初始常量配置
require_once dirname(BASEPATH) . '/application/config/constants.php';

// 捕获异常退出
register_shutdown_function(function () {
    error_get_last() && call_user_func_array([new Event, 'error'], error_get_last());
});
