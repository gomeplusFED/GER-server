<?php

use App\Services\Event;

$hook['post_controller_constructor'][] = function () {
    // 重新绑定实例
    $app =& get_instance();
    $app = app();
};

$hook['pre_system'][] = function () {
    // 绑定异常处理
    set_error_handler([new Event, 'error']);
    set_exception_handler([new Event, 'exception']);
};
