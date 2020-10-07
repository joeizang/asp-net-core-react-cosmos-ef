using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace WebApp.Models
{
    public class TaskItem
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Owner { get; set; }

        public bool Completed { get; set; }

        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}