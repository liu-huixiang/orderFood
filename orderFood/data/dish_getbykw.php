<?php
header('Content-Type:application/json');

//�����û�������������
@$kw = $_REQUEST['kw'];
if(empty($kw))
{
  echo '[]';
  return;
}

//�������ݿ⣬�����ݿ��е�kf_dish����
//��$startλ�ö�5������

require('init.php');
$sql = "select did,name,price,img_sm,material from kf_dish where name like '%$kw%' or material like '%$kw%'";
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