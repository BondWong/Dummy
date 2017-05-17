#include <sstream>
#include <iostream>
#include "OrderBook.hpp"
#include "visualise.hpp"

#include <limits>

void pause_()
{
	std::cout << "Press ENTER to continue..." << std::flush;
	std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

template <typename T>
std::string to_string_via_sstream(T x)
{
	std::stringstream s;
	s << x;
	return s.str();
}

#pragma warning( push, 1 ) //this version of CImg generates warnings in 64bit mode
#pragma warning (disable : 4319 4706)
#include "CImg.h"
#pragma warning(pop)

namespace
{
	const unsigned int image_width = 1024u;
	const unsigned int image_height = 768u;
	
	cimg_library::CImgDisplay disp(image_width, image_height, "Aggregate order book", 0, false, true);
}

void display_aggregate_order_book_graphics(const VisualiseData & vd)
{
	// aggregate order book
	cimg_library::CImg<unsigned int> image(/*x*/image_width,/*y*/image_height,/*z*/1u,/*channels*/3u,/*initial fill*/0u);
	
	
	const unsigned int row_height = 40u;
	const unsigned int row_gap = 10u;
	const unsigned int col_width = 50u;
	const unsigned int col_sep = 10u;
	const unsigned int bar_col_width = image_width / 2u - 3u * (col_width + col_sep);
	
	const unsigned int green[] = { 0u,255u,0u };
	const unsigned int red[] = { 255u,0u,0u };
	const unsigned int white[] = { 255u,255u,255u };
	
	unsigned int row_start = 5u;
	
	const unsigned int buy_col1 = bar_col_width + col_sep;
	const unsigned int buy_col2 = buy_col1 + col_width + col_sep;
	const unsigned int buy_col3 = buy_col2 + col_width + col_sep;
	
	const unsigned int divider_x = image_width / 2u;
	
	const unsigned int sell_col1 = divider_x + col_sep;
	const unsigned int sell_col2 = sell_col1 + col_width + col_sep;
	const unsigned int sell_col3 = sell_col2 + col_width + col_sep;
	
	image.draw_line(divider_x, 0u, divider_x, image_height, white);
	
	
	image.draw_text(buy_col1, row_start, "BUY orders", white, 0);
	image.draw_text(sell_col1, row_start, "SELL orders", white, 0);
	
	row_start += row_height + row_gap;
	
	image.draw_text(buy_col1, row_start, "# orders", white, 0);
	image.draw_text(buy_col2, row_start, "Volume", white, 0);
	image.draw_text(buy_col3, row_start, "Price", white, 0);

	image.draw_text(sell_col1, row_start, "# orders", white, 0);
	image.draw_text(sell_col2, row_start, "Volume", white, 0);
	image.draw_text(sell_col3, row_start, "Price", white, 0);
	
	for (auto iterBUY = vd.m_buy.begin(), iterSELL = vd.m_sell.begin(); iterBUY != vd.m_buy.end() || iterSELL != vd.m_sell.end(); ((iterBUY != vd.m_buy.end()) ? (++iterBUY) : iterBUY), ((iterSELL != vd.m_sell.end()) ? (++iterSELL) : iterSELL))
	{
		row_start += row_height + row_gap;
		
		if (iterBUY != vd.m_buy.end())
		{
			image.draw_rectangle(bar_col_width - iterBUY->m_volume, row_start, bar_col_width, row_start + row_height, green);
		
			image.draw_text(buy_col1, row_start, to_string_via_sstream(iterBUY->m_number_of_orders).c_str(), white, 0);
			image.draw_text(buy_col2, row_start, to_string_via_sstream(iterBUY->m_volume).c_str(), white, 0);
			image.draw_text(buy_col3, row_start, iterBUY->m_price.c_str(), white, 0);
		}
		else
		{
			
		}
		
		if (iterSELL != vd.m_sell.end())
		{
			image.draw_rectangle(image_width - bar_col_width, row_start, image_width - bar_col_width + iterSELL->m_volume, row_start + row_height, red);
			
			image.draw_text(sell_col1, row_start, to_string_via_sstream(iterSELL->m_number_of_orders).c_str(), white, 0);
			image.draw_text(sell_col2, row_start, to_string_via_sstream(iterSELL->m_volume).c_str(), white, 0);
			image.draw_text(sell_col3, row_start, iterSELL->m_price.c_str(), white, 0);
		}
		else
		{
			
		}
		
		
		
	}
	
	//image.display("Aggregrate order book", false);
	//cimg_library::CImgDisplay disp(image, "Aggregate order book");
	disp.display(image);
	disp.show();
	while (!disp.is_closed() && !disp.key()) { disp.wait(); }
	if (disp.is_keyQ())
		exit(1u);
	//disp.wait(20u);
	disp.flush();
}
#include <iomanip>

void display_aggregate_order_book_console(const VisualiseData & vd)
{
	std::cout << std::endl;
	std::cout << std::endl;
	std::cout << "*** Aggregated order book follows: " << std::endl;
	
	std::cout << std::setw(40u) << std::left << "BUY side";
	std::cout << std::left << "SELL side";
	std::cout << std::endl;
	
	std::cout << std::setw(10u) << std::left << "# orders";
	std::cout << std::setw(10u) << std::left << "Volume";
	std::cout << std::setw(20u) << std::left << "Price";
	std::cout << std::setw(10u) << std::left << "# orders";
	std::cout << std::setw(10u) << std::left << "Volume";
	std::cout << std::left << "Price";
	std::cout << std::endl;
		
	//const std::size_t col_width = 35u;
	for (auto iterBUY = vd.m_buy.begin(), iterSELL = vd.m_sell.begin(); iterBUY != vd.m_buy.end() || iterSELL != vd.m_sell.end(); ((iterBUY != vd.m_buy.end()) ? (++iterBUY) : iterBUY), ((iterSELL != vd.m_sell.end()) ? (++iterSELL) : iterSELL))
	{
		//std::string entry;
		if (iterBUY != vd.m_buy.end())
		{
			std::cout << std::setw(10u) << std::left << to_string_via_sstream(iterBUY->m_number_of_orders);
			std::cout << std::setw(10u) << std::left << to_string_via_sstream(iterBUY->m_volume);
			std::cout << std::setw(20u) << std::left << iterBUY->m_price;
			//entry = to_string_via_sstream(iterBUY->m_number_of_orders) + "\t" + to_string_via_sstream(iterBUY->m_volume) + "\t" + iterBUY->m_price;
		}
		else
		{
			std::cout << std::setw(40u) << "";
			//entry = "";
		}
		//std::cout << entry << std::string(col_width - entry.length(), ' ');
		
		if (iterSELL != vd.m_sell.end())
		{
			std::cout << std::setw(10u) << std::left << to_string_via_sstream(iterSELL->m_number_of_orders);
			std::cout << std::setw(10u) << std::left << to_string_via_sstream(iterSELL->m_volume);
			std::cout << std::left << iterSELL->m_price;
			//entry = to_string_via_sstream(iterSELL->m_number_of_orders + "\t" + to_string_via_sstream(iterSELL->m_volume) + "\t" + iterSELL->m_price;
		}
		else
		{
			//entry = "";
		}
		//std::cout << entry << std::string(col_width - entry.length(), ' ');
		std::cout << std::endl;
		
	}
	std::cout << std::endl;
	pause_();
}

#ifdef AM_ADAM
#include <fstream>

void dump_tex_aggregated_order_book(std::ostream &out, const VisualiseData & vd);

namespace
{
	std::ofstream orderoutputf("orderbook.out.txt");
}

void display_aggregate_order_book_tex(const VisualiseData & vd)
{
	dump_tex_aggregated_order_book(orderoutputf, vd);
}
#else
void display_aggregate_order_book_tex(const VisualiseData &)
{
	// not implemented for anyone but adam...!
}
#endif

void display_aggregate_order_book_nothing(const VisualiseData &)
{
	// do nothing

}

//__declspec(dllexport)
void display_aggregate_order_book(const VisualiseData & vd, DisplayType dt)
{
	switch(dt)
	{
		case DisplayType::CONSOLE:
			display_aggregate_order_book_console(vd);
			break;
		case DisplayType::GRAPHICS:
			display_aggregate_order_book_graphics(vd);
			break;
		case DisplayType::TEX:
			display_aggregate_order_book_tex(vd);
			break;
		case DisplayType::NONE:
			display_aggregate_order_book_nothing(vd);
			break;
	}
}

/*
__declspec(dllexport)
BOOL WINAPI DllMain(HINSTANCE hinstDLL,DWORD fdwReason,LPVOID lpvReserved)
{
	std::cout<<"ksfjds;"<<std::endl;
	return TRUE;
}

__declspec(dllexport)
int foo(){
	return 39;
}
*/

