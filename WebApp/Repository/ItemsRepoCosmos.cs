using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using WebApp.Models;

namespace WebApp.Repository
{
    public class ItemsRepoCosmos : IItemsRepo
    {
        private readonly Container _container;

        public ItemsRepoCosmos(
            CosmosClient dbClient,
            string databaseName,
            string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<TaskItem> AddItemAsync(TaskItem item)
        {
            item.Id = Guid.NewGuid().ToString();
            item.Created = DateTime.Now;
            item.Modified = DateTime.Now;

            await _container.CreateItemAsync(item, new PartitionKey(item.Id));
            return item;
        }

        public async Task DeleteItemAsync(string id, string username)
        {
            var itemToDelete = await GetItemAsync(id);
            if (itemToDelete == null || !itemToDelete.Owner.Equals(username))
            {
                return;
            }
            await _container.DeleteItemAsync<TaskItem>(id, new PartitionKey(id));
        }

        public async Task<TaskItem> GetItemAsync(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<TaskItem>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async IAsyncEnumerable<TaskItem> GetItemsAsync()
        {
            var query =
                _container.GetItemQueryIterator<TaskItem>(new QueryDefinition("SELECT * FROM c"));

            while (query.HasMoreResults)
            {
                foreach (var taskItem in await query.ReadNextAsync())
                {
                    yield return taskItem;
                }
            }
        }

        public async Task<TaskItem> UpdateItemAsync(string id, TaskItem item)
        {
            var itemToUpdate = await GetItemAsync(id);
            if (itemToUpdate == null)
            {
                return null;
            }
            item.Created = itemToUpdate.Created;
            item.Modified = DateTime.Now;

            await _container.UpsertItemAsync(item, new PartitionKey(id));
            return item;
        }
    }
}