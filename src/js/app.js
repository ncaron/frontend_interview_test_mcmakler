const App = {
  pages: {},
  currentPage: 1,
  itemsPerPage: 12,
  cacheElements() {
    this.contentArea = document.getElementById('content');
  },
  cacheTemplates() {
    this.propertyTemplate = document.getElementById('property-template').innerHTML.trim();
    this.paginationTemplate = document.getElementById('pagination-template').innerHTML.trim();
  },
  getData() {
    const url = 'https://api.mcmakler.de/v1/advertisements';
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.send();

    request.addEventListener('load', () => {
      this.data = JSON.parse(request.response).data;
      this.totalPages = this.data.length / this.itemsPerPage;
      this.handlePageCreation();
      this.pages[this.currentPage].display(this.contentArea);
    });
  },
  handlePageCreation() {
    const start = (this.currentPage - 1) * 12;
    const end = start + this.itemsPerPage;

    if (!this.pages[this.currentPage]) {
      this.pages[this.currentPage] = new Page(this.currentPage, this.data.slice(start, end));
    }
  },
  bindEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target;

      if (target.nodeName === 'BUTTON') {
        if (target.classList.contains('next') && this.currentPage < this.totalPages) {
          this.currentPage += 1;
        } else if (target.classList.contains('prev') && this.currentPage !== 1) {
          this.currentPage -= 1;
        }

        this.handlePageCreation();
        this.pages[this.currentPage].display(this.contentArea);
      }
    });
  },
  init() {
    this.cacheElements();
    this.cacheTemplates();
    this.bindEvents();
    this.getData();
  },
};

class Property {
  constructor(property, template) {
    this.property = property;
    this.propertyHTML = template;
    this.purpose = this.getPurpose();
    this.title = property.title;
    this.location = property.realestateSummary.address.street;
    this.price = this.getPrice();
    this.numberOfRooms = property.realestateSummary.numberOfRooms;
    this.space = parseFloat(property.realestateSummary.space.toFixed(2));
    this.image = this.getImage();
  }

  // determines if the property if for rent(0) or for sale(1)
  getPurpose() {
    return this.property.purpose === 0 ? 'Mieten' : 'Kaufen';
  }

  getPrice() {
    return this.property.advertisementPrice.baseRent ||
           this.property.advertisementPrice.sellPrice;
  }

  // some properties only have 1 image and not in array, this makes sure an image is fetches
  getImage() {
    return this.property.advertisementAssets.advertisementThumbnails.inventory_m.url ||
           this.property.advertisementAssets[0].advertisementThumbnails.inventory_m.url;
  }

  createPropertyHTML() {
    this.propertyHTML = this.propertyHTML.replace(/{{PURPOSE}}/g, this.purpose);
    this.propertyHTML = this.propertyHTML.replace(/{{TITLE}}/g, this.title);
    this.propertyHTML = this.propertyHTML.replace(/{{LOCATION}}/g, this.location);
    this.propertyHTML = this.propertyHTML.replace(/{{PRICE}}/g, this.price);
    this.propertyHTML = this.propertyHTML.replace(/{{ROOMS}}/g, this.numberOfRooms);
    this.propertyHTML = this.propertyHTML.replace(/{{SPACE}}/g, this.space);
    this.propertyHTML = this.propertyHTML.replace(/{{IMAGE}}/g, this.image);

    return this.propertyHTML;
  }
}

class Page {
  constructor(pageNumber, properties) {
    this.pageNumber = pageNumber;
    this.properties = properties;
    this.formattedProperties = this.formatProperties();
    this.pagination = this.buildPagination();
    this.buildPage();
  }

  formatProperties() {
    return this.properties.map(property =>
      new Property(property, App.propertyTemplate).createPropertyHTML());
  }

  buildPage() {
    this.page = '';

    this.formattedProperties.forEach((property) => {
      this.page += property;
    });

    this.page += this.pagination;
  }

  buildPagination() {
    return App.paginationTemplate.replace(/{{PAGENUMBER}}/g, this.pageNumber);
  }

  display(contentArea) {
    const newContentArea = contentArea;
    newContentArea.innerHTML = this.page;
  }
}

App.init();
