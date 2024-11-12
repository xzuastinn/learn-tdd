import Author from '../models/author'; // Adjust the import to your Author model path
import { getAuthorList, showAllAuthors } from '../pages/authors'; // Adjust the import to your function
import { Response } from 'express';

describe('getAuthorList', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should fetch and format the authors list correctly', async () => {
        // Define the sorted authors list as we expect it to be returned by the database
        const sortedAuthors = [
            {
                first_name: 'Jane',
                family_name: 'Austen',
                date_of_birth: new Date('1775-12-16'),
                date_of_death: new Date('1817-07-18')
            },
            {
                first_name: 'Amitav',
                family_name: 'Ghosh',
                date_of_birth: new Date('1835-11-30'),
                date_of_death: new Date('1910-04-21')
            },
            {
                first_name: 'Rabindranath',
                family_name: 'Tagore',
                date_of_birth: new Date('1812-02-07'),
                date_of_death: new Date('1870-06-09')
            }
        ];

        // Mock the find method to chain with sort
        const mockFind = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(sortedAuthors)
        });

        // Apply the mock directly to the Author model's `find` function
        Author.find = mockFind;

        // Act: Call the function to get the authors list
        const result = await getAuthorList();

        // Assert: Check if the result matches the expected sorted output
        const expectedAuthors = [
            'Austen, Jane : 1775 - 1817',
            'Ghosh, Amitav : 1835 - 1910',
            'Tagore, Rabindranath : 1812 - 1870'
        ];
        expect(result).toEqual(expectedAuthors);

        // Verify that `.sort()` was called with the correct parameters
        expect(mockFind().sort).toHaveBeenCalledWith([['family_name', 'ascending']]);

    });

    it('should format fullname as empty string if first name is absent', async () => {
        // Define the sorted authors list as we expect it to be returned by the database
        const sortedAuthors = [
            {
                first_name: '',
                family_name: 'Austen',
                date_of_birth: new Date('1775-12-16'),
                date_of_death: new Date('1817-07-18')
            },
            {
                first_name: 'Amitav',
                family_name: 'Ghosh',
                date_of_birth: new Date('1835-11-30'),
                date_of_death: new Date('1910-04-21')
            },
            {
                first_name: 'Rabindranath',
                family_name: 'Tagore',
                date_of_birth: new Date('1812-02-07'),
                date_of_death: new Date('1870-06-09')
            }
        ];

        // Mock the find method to chain with sort
        const mockFind = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(sortedAuthors)
        });

        // Apply the mock directly to the Author model's `find` function
        Author.find = mockFind;

        // Act: Call the function to get the authors list
        const result = await getAuthorList();

        // Assert: Check if the result matches the expected sorted output
        const expectedAuthors = [
            ' : 1775 - 1817',
            'Ghosh, Amitav : 1835 - 1910',
            'Tagore, Rabindranath : 1812 - 1870'
        ];
        expect(result).toEqual(expectedAuthors);

        // Verify that `.sort()` was called with the correct parameters
        expect(mockFind().sort).toHaveBeenCalledWith([['family_name', 'ascending']]);

    });

    it('should return an empty array when an error occurs', async () => {
        // Arrange: Mock the Author.find() method to throw an error
        Author.find = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        // Act: Call the function to get the authors list
        const result = await getAuthorList();

        // Assert: Verify the result is an empty array
        expect(result).toEqual([]);
    });

    it('should format fullname as empty string if last name is absent', async () => {
        // Define the sorted authors list as we expect it to be returned by the database
        const sortedAuthors = [
            {
                first_name: 'Jane',
                family_name: '',
                date_of_birth: new Date('1775-12-16'),
                date_of_death: new Date('1817-07-18')
            },
            {
                first_name: 'Amitav',
                family_name: 'Ghosh',
                date_of_birth: new Date('1835-11-30'),
                date_of_death: new Date('1910-04-21')
            },
            {
                first_name: 'Rabindranath',
                family_name: 'Tagore',
                date_of_birth: new Date('1812-02-07'),
                date_of_death: new Date('1870-06-09')
            }
        ];
    
        // Mock the find method to chain with sort
        const mockFind = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(sortedAuthors)
        });
    
        // Apply the mock directly to the Author model's `find` function
        Author.find = mockFind;
    
        // Act: Call the function to get the authors list
        const result = await getAuthorList();
    
        // Assert: Check if the result matches the expected sorted output
        const expectedAuthors = [
            ' : 1775 - 1817',
            'Ghosh, Amitav : 1835 - 1910',
            'Tagore, Rabindranath : 1812 - 1870'
        ];
        expect(result).toEqual(expectedAuthors);
    
        // Verify that `.sort()` was called with the correct parameters
        expect(mockFind().sort).toHaveBeenCalledWith([['family_name', 'ascending']]);
    });
    
    it('should return an empty array when an error occurs', async () => {
        // Arrange: Mock the Author.find() method to throw an error
        Author.find = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        // Act: Call the function to get the authors list
        const result = await getAuthorList();

        // Assert: Verify the result is an empty array
        expect(result).toEqual([]);
    });
    
});

describe('showAllAuthors', () => {
    let res: Partial<Response>;
  
    beforeEach(() => {
      res = {
        send: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('simple test for showAllAuthors', async () => {
        // Do not mock anything
        // Create a minimal res object
        const res = {
          send: jest.fn(),
        } as unknown as Response;
      
        // Call showAllAuthors
        await showAllAuthors(res);
      
        // Expect res.send to have been called
        expect(res.send).toHaveBeenCalled();
      });
  
    it('should send the authors list when authors are found', async () => {
      // Mock authors returned from the database
      const sortedAuthors = [
        {
          first_name: 'Jane',
          family_name: 'Austen',
          date_of_birth: new Date('1775-12-16'),
          date_of_death: new Date('1817-07-18'),
          get name() {
            return `${this.family_name}, ${this.first_name}`;
          },
          get lifespan() {
            return '1775 - 1817';
          },
        },
      ];
  
      // Mock Author.find().sort()
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(sortedAuthors),
      });
      Author.find = mockFind;
  
      // Act
      await showAllAuthors(res as Response);
  
      // Assert
      expect(res.send).toHaveBeenCalledWith(['Austen, Jane : 1775 - 1817']);
    });
  
    it('should send "No authors found" when no authors are available', async () => {
      // Mock Author.find().sort() to return an empty array
      const mockFind = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });
      Author.find = mockFind;
  
      // Act
      await showAllAuthors(res as Response);
  
      // Assert
      expect(res.send).toHaveBeenCalledWith('No authors found');
    });
  
    it('should send "No authors found" when an error occurs', async () => {
      // Mock Author.find() to throw an error
      Author.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
  
      // Act
      await showAllAuthors(res as Response);
  
      // Assert
      expect(res.send).toHaveBeenCalledWith('No authors found');
    });
});

