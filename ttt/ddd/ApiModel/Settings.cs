using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ApiModel
{
    public class SettingsItem
    {
        [Key]
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
