using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApp.Models;

namespace WebApp.Repository
{
    public interface IItemsRepo
    {
        IAsyncEnumerable<TaskItem> GetItemsAsync();
        Task<TaskItem> GetItemAsync(string id);
        Task<TaskItem> AddItemAsync(TaskItem item);
        Task<TaskItem> UpdateItemAsync(string id, TaskItem item);
        Task DeleteItemAsync(string id, string username);
    }

    public class ItemsRepoEf : IItemsRepo
    {
        private readonly TasksContext _tasksContext;

        public ItemsRepoEf(TasksContext tasksContext)
        {
            _tasksContext = tasksContext;
        }

        public async Task<TaskItem> AddItemAsync(TaskItem item)
        {
            item.Id = Guid.NewGuid().ToString();
            item.Created = DateTime.Now;
            item.Modified = DateTime.Now;

            await _tasksContext.TaskItems.AddAsync(item);
            await _tasksContext.SaveChangesAsync();
            return item;
        }

        public async Task DeleteItemAsync(string id, string username)
        {
            var itemToDelete = await GetItemAsync(id);
            if (itemToDelete == null || !itemToDelete.Owner.Equals(username))
            {
                return;
            }
            _tasksContext.Entry(itemToDelete).State = EntityState.Deleted;
            await _tasksContext.SaveChangesAsync();
        }

        public async Task<TaskItem> GetItemAsync(string id)
        {
            return await _tasksContext.FindAsync<TaskItem>(id);
        }

        public IAsyncEnumerable<TaskItem> GetItemsAsync() => _tasksContext.TaskItems;

        public async Task<TaskItem> UpdateItemAsync(string id, TaskItem item)
        {
            var itemToUpdate = await GetItemAsync(id);
            if (itemToUpdate == null)
            {
                return null;
            }

            item.Created = itemToUpdate.Created;
            item.Modified = DateTime.Now;

            _tasksContext.Entry(itemToUpdate).CurrentValues.SetValues(item);
            await _tasksContext.SaveChangesAsync();

            return itemToUpdate;
        }
    }
}