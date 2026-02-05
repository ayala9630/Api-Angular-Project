using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChineseSaleApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonorLottery_Donors_CardsId",
                table: "DonorLottery");

            migrationBuilder.RenameColumn(
                name: "CardsId",
                table: "DonorLottery",
                newName: "DonorsId");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAdmin",
                table: "Users",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddForeignKey(
                name: "FK_DonorLottery_Donors_DonorsId",
                table: "DonorLottery",
                column: "DonorsId",
                principalTable: "Donors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonorLottery_Donors_DonorsId",
                table: "DonorLottery");

            migrationBuilder.RenameColumn(
                name: "DonorsId",
                table: "DonorLottery",
                newName: "CardsId");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAdmin",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DonorLottery_Donors_CardsId",
                table: "DonorLottery",
                column: "CardsId",
                principalTable: "Donors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
