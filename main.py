import requests
from bs4 import BeautifulSoup

# Base URL
base_url = 'https://gamefinity.pl/produkty/gry/sony-playstation-4/wszystkie/{page}?cena_od=0&cena_do=0&availability%5B%5D=dostepny&availability%5B%5D=na-zamowienie&availability%5B%5D=niedostepny'

# Initial value
start_value = 1
last_value = 89

# Function to save data to a file
def save_to_file(data, file_name):
    with open(file_name, 'a', encoding='utf-8') as file:
        for entry in data:
            file.write(f"{entry['product_link']}; {entry['product_title']}; {entry['image_link']}\n")

# Function to scrape data from a page
def scrape_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all products on the page
    products = soup.find_all('div', class_='col-6 col-sm-4 col-md-3 col-lg-5ths')
    results = []
    
    for product_div in products:
        try:
            # Get the product link
            product_link = product_div.find('a', href=True)['href']
            
            # Get the product title
            product_title = product_div.find('a', title=True)['title']
            
            # Get the image link
            image_link = product_div.find('img', src=True)['src']
            
            # Add results to the list
            results.append({
                'product_link': f"https://gamefinity.pl{product_link}",
                'product_title': product_title,
                'image_link': f"https://gamefinity.pl{image_link}"
            })
        except Exception as e:
            print(f"Failed to process product: {e}")
    
    return results

# Clear the file at the start
file_name = 'gamefinity_data.txt'
with open(file_name, 'w', encoding='utf-8') as file:
    file.write('')

# Process all pages
for page in range(start_value, last_value + 1):
    print(f"Processing page {page}...")
    page_url = base_url.format(page=page)
    products_data = scrape_page(page_url)
    save_to_file(products_data, file_name)

print("Scraping completed successfully. Results saved in gamefinity_data.txt.")
