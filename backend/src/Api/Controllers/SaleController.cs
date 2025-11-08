using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Contracts;
using Application.Services;

namespace Api.Controllers;

[ApiController]
[Route("api/sales")]
[Authorize]
public class SaleController : ControllerBase
{
    private readonly SaleService _saleService;

    public SaleController(SaleService saleService)
    {
        _saleService = saleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
    {
        var sales = await _saleService.GetAllAsync(cancellationToken);
        return Ok(sales);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken = default)
    {
        var sale = await _saleService.GetByIdAsync(id, cancellationToken);
        return Ok(sale);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSaleRequest request, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (request.SaleItems == null || !request.SaleItems.Any())
        {
            return BadRequest(new { message = "La venta debe tener al menos un item" });
        }

        try
        {
            var sale = await _saleService.CreateAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = sale.Id }, sale);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _saleService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = $"Sale with id {id} not found" });
        }
    }

    [HttpGet("report")]
    public async Task<IActionResult> GetSalesReport(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        if (startDate > endDate)
        {
            return BadRequest(new { message = "La fecha de inicio debe ser anterior a la fecha de fin" });
        }

        var report = await _saleService.GetSalesReportAsync(startDate, endDate, cancellationToken);
        return Ok(report);
    }
}

