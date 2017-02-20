<?php
//https://zhuanlan.zhihu.com/p/23635549
// 设置环境变量
$_['APP_ENV'] = getenv('APP_ENV') ?: 'develop';

// 是否调试模式
$_['APP_DEBUG'] = (getenv('APP_DEBUG') OR $_['APP_ENV'] === 'develop');

// 设置应用目录
$_['APPPATH'] = dirname(__DIR__) . '/';

// 设置 CI 框架目录
$_['BASEPATH'] = $_['APPPATH'] . 'vendor/codeigniter/framework/system/';

// 设置模版目录
$_['VIEWPATH'] = $_['APPPATH'] . 'resources/views/';

// 循环定义系统常量
array_walk($_, function ($v, $k) {
    defined($k) OR define($k, $v);
});

// 设置运行环境与控制器分组
// nginx 设置环境变量SetEnv 控制路由分组
define('ENVIRONMENT', $routing['directory'] = APP_ENV);
// 调试环境下配置
if (APP_DEBUG) {
    ini_set('display_errors', 1);
    ini_set('error_reporting', -1);
    ini_set('opcache.enable', 0);
}
// 请求 CI 框架入口
require_once BASEPATH . 'core/CodeIgniter.php';
