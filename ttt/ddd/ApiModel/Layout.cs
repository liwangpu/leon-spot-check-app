using System;
using System.Collections.Generic;
using System.Text;
using BambooCommon;

namespace ApiModel
{
    public class Layout : Asset
    {
        /// <summary>
        /// 省
        /// </summary>
        public string Province { get; set; }
        /// <summary>
        /// 市
        /// </summary>
        public string City { get; set; }
        /// <summary>
        /// 区
        /// </summary>
        public string District { get; set; }
        /// <summary>
        /// 实际地址
        /// </summary>
        public string Address { get; set; }
        /// <summary>
        /// 地图经纬度坐标，longitude/latitude，格式类似 POINT(-71.060316 48.432044)
        /// </summary>
        public string GeoPos { get; set; }

        /// <summary>
        /// 平面图路径
        /// </summary>
        public string PlanImageUrl { get; set; }
        /// <summary>
        /// 平面图比例尺， 1像素表示多长现实中的单位毫米。用整数是为了防止精度误差
        /// 62表示，1像素=62mm=6.2cm. 最小缩放值为1米=1000像素。
        /// 最小比例尺为1比1，4k分辨率的图片最小可以表示4米x2米的实际值。再小就只能缩放图片了。
        /// </summary>
        public int PlanImageScale { get; set; }

        /// <summary>
        /// 户型数据,内容为类LayoutData的Json字符串。
        /// </summary>
        public string Data { get; set; }

    }

    /// <summary>
    /// Layout的Data属性的实际结构
    /// </summary>
    public class LayoutData
    {
        /// <summary>
        /// 墙体
        /// </summary>
        public List<Wall> Walls { get; set; }
        /// <summary>
        /// 区域定义
        /// </summary>
        public List<Region> Regions { get; set; }

        /// <summary>
        /// 下次分配对象时用的ID，从1开始，最大9999. 方案里面的对象从10000开始
        /// </summary>
        public int NextId { get; set; }
    }

    /// <summary>
    /// 区域，一个二维的封闭多边形拉高而成的三维几何体的区域
    /// </summary>
    public class Region
    {
        /// <summary>
        /// 区域名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 包围盒大小，单位厘米，格式 x,y,z，使用Vector3类来解析
        /// </summary>
        public string BoundBoxVec { get; set; }
        /// <summary>
        /// 区域的面积，单位 平方米
        /// </summary>
        public float AreaCentare { get; set; }
        /// <summary>
        /// 区域的体积，立方米
        /// </summary>
        public float VolumeStere { get; set; }
        /// <summary>
        /// 组成这个区域的二位多边形的顶点信息。格式为 x1,y1;x2,y2;...xn,yn;
        /// </summary>
        public string Points { get; set; }
        /// <summary>
        /// 高度
        /// </summary>
        public float Height { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

        /// <summary>
        /// 所有的墙体
        /// </summary>
        public List<WallFace> Walls { get; set; }
    }

    /// <summary>
    /// 表示一个墙
    /// </summary>
    public class Wall
    {
        /// <summary>
        /// 在当前户型里唯一的ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 厚度，mm
        /// </summary>
        public int ThicknessMM { get; set; }
        /// <summary>
        /// 长度，mm
        /// </summary>
        public int LengthMM { get; set; }
        /// <summary>
        /// 高度, mm
        /// </summary>
        public int HeightMM { get; set; }
        
        /// <summary>
        /// 定义墙体在水平平面的形状。如果Path为空，则墙体为简单的长方体，尺寸为length,height,thickness。否则使用SVG的Path语法定义形状。直线，贝塞尔曲线，圆弧
        /// </summary>
        public string Path { get; set; }

        public Vector2 StartPoint { get; set; }

        public Vector2 EndPoint { get; set; }

        /// <summary>
        /// 墙上的洞，门窗之类的
        /// </summary>
        public List<WallHole> Holes { get; set; }
        /// <summary>
        /// 踢脚线，顶角线，腰线等装饰
        /// </summary>
        public List<WallSkirting> Skirtings { get; set; }
    }

    /// <summary>
    /// 表示墙上的洞，门，窗，壁龛等
    /// </summary>
    public class WallHole
    {
        /// <summary>
        /// 在当前户型里唯一的ID
        /// </summary>
        public int Id { get; set; }
        public string Name { get; set; }
        public Vector2 Location { get; set; }
        /// <summary>
        /// 如果Path为空则此洞为标准的长方体洞。此属性表示洞的长宽的一半的数值
        /// </summary>
        public Vector2 HalfSize { get; set; }
        /// <summary>
        /// 洞的深度
        /// </summary>
        public int Thickness { get; set; }
        /// <summary>
        /// 如果此属性不为空，则表示此洞为一个复杂的封闭区域，由SVG的Path语法描述一个封闭区域。
        /// </summary>
        public string Path { get; set; }
    }

    /// <summary>
    /// 墙面，一堵墙有多个面，墙面可以被划在一个区域中。但是墙体属于整个户型
    /// </summary>
    public class WallFace
    {
        /// <summary>
        /// 在当前户型里唯一的ID
        /// </summary>
        public int Id { get; set; }
        public int WallId { get; set; }
        public int FaceIndex { get; set; }
        public string Remark { get; set; }
    }

    /// <summary>
    /// 裙料，墙上条状装饰覆盖物的配置信息，比如踢脚线，顶角线，腰线等的位置与长度，材质。
    /// </summary>
    public class WallSkirting
    {
        /// <summary>
        /// 在当前户型里唯一的ID
        /// </summary>
        public int Id { get; set; }
        public int WallId { get; set; }
        public string SkirtingId { get; set; }
        public Vector2 Location { get; set; }
        /// <summary>
        /// 踢脚线等为简单的直线延伸，则此属性表示延伸长度。如果启用Path属性，则忽略此属性
        /// </summary>
        public int Length { get; set; }
        /// <summary>
        /// 因为裙料是紧随墙面弯曲的，这是指定其在墙面的2D平面上的形状，默认就是从墙的开始到结束的直线，https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths 
        /// </summary>
        public string Path { get; set; }
        public string MaterialId { get; set; }
    }

    /// <summary>
    /// 墙上条状装饰覆盖物，由一个横截面拉长而成的物体，比如踢脚线，顶角线，腰线等。
    /// 轴心在左下角，靠墙的顶角上。
    /// </summary>
    public class Skirting : Asset
    {
        /// <summary>
        /// 横截面路径，采用SVG的path的语法， M,L,C,S,Q,T,A来移动，绘制线条，绘制三次贝塞尔曲线，二次贝塞尔曲线，圆弧。
        /// 参考 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths 
        /// </summary>
        public string LateralPath { get; set; }
        /// <summary>
        /// 最大厚度
        /// </summary>
        public int Thickness { get; set; }
        /// <summary>
        /// 最大高度
        /// </summary>
        public int Height { get; set; }
    }
}
