<?php
header('Content-Type:application/json');

//�����û�������������
@$phone = $_REQUEST['phone'];
if(empty($phone))
{
  echo '[]';
  return;
}

//�������ݿ⣬�����ݿ��е�kf_dish����
//��$startλ�ö�5������

require('init.php');
//����ѯ
$sql = "select kf_order.user_name,kf_dish.img_sm,kf_order.oid,kf_order.order_time,kf_order.did from kf_dish,kf_order where kf_order.did=kf_dish.did and kf_order.phone=$phone";
$result = mysqli_query($conn,$sql);

//���ظ��ͻ���
//��fetchAll ��fetch_assoc
$output=[];
while(true)
{
  $row = mysqli_fetch_assoc($result);
  if(!$row)//û�и��������˳�ѭ��
  {
    break;
  }
  $output[] = $row;
}

echo json_encode($output);



?>