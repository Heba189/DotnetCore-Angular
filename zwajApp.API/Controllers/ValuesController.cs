﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace zwajApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            _context = context;
        }
        //Gete http://localhost:5000/api/values
        // GET api/values
        // [AllowAnonymous]
        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<IActionResult>  GetValues()
        {
            var values =await _context.Values.ToListAsync();
            return Ok(values) ;
        }

        // GET api/values/5
        // [AllowAnonymous]
        [Authorize(Roles ="Member")]
        [HttpGet("{id}")]
        public async Task<IActionResult>  GetValues(int id)
        {
            var value =await _context.Values.FirstOrDefaultAsync(x =>x.id == id);
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {

        }
    }
}
