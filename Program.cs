/*! ************************************************************* */
/*! Copyright (c) 1991-2026 Apryse Software Corp.   */
/*! All Rights Reserved. */
/*! ************************************************************* */
using DocumentCompareDemo;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "./static";
});

var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseSpa(spa =>
{
    if (app.Environment.IsDevelopment())
        spa.UseNpmDevServer(sourcePath: ".");
});

app.Run();