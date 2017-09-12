<?php
header('Content-Type:application/json');

//解析用户传递来的数据
@$phone = $_REQUEST['phone'];
if(empty($phone))
{
  echo '[]';
  return;
}

//连接数据库，从数据库中的kf_dish表中
//的$start位置读5条数据

require('init.php');
//多表查询
$sql = "select kf_order.user_name,kf_dish.img_sm,kf_order.oid,kf_order.order_time,kf_order.did from kf_dish,kf_order where kf_order.did=kf_dish.did and kf_order.phone=$phone";
$result = mysqli_query($conn,$sql);

//返回给客户端
//①fetchAll ②fetch_assoc
$output=[];
while(true)
{
  $row = mysqli_fetch_assoc($result);
  if(!$row)//没有更多数据退出循环
  {
    break;
  }
  $output[] = $row;
}

echo json_encode($output);



?>