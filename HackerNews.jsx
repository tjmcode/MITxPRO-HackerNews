// #region  H E A D E R
// <copyright file="HackerNews.js" company="MicroCODE Incorporated">Copyright © 2022 MicroCODE, Inc. Troy, MI</copyright><author>Timothy J. McGuire</author>
// #region  P R E A M B L E
// #region  D O C U M E N T A T I O N
/*
 *      Title:    HackerNews Component
 *      Module:   Modules (./HackerNews.jsx)
 *      Project:  MIT Hacker News
 *      Customer: MIT xPRO
 *      Creator:  MicroCODE Incorporated
 *      Date:     May 2022
 *      Author:   Timothy J McGuire
 *
 *      Designed and Coded: 2022 MicroCODE Incorporated
 *
 *      This software and related materials are the property of
 *      MicroCODE Incorporated and contain confidential and proprietary
 *      information. This software and related materials shall not be
 *      duplicated, disclosed to others, or used in any way without the
 *      written of MicroCODE Incorported.
 *
 *
 *      DESCRIPTION:
 *      ------------
 *
 *      This module implements the 'HackerNews' component of an HACKER NEWS App.
 *
 *
 *      REFERENCES:
 *      -----------
 *
 *      1. MIT xPRO WEEK 15: Starter Code
 *
 *
 *
 *      DEMONSTRATION VIDEOS:
 *      --------------------
 *
 *      1. ...
 *
 *
 *
 *      MODIFICATIONS:
 *      --------------
 *
 *  Date:         By-Group:   Rev:     Description:
 *
 *  08-May-2022   TJM-MCODE  {0001}    New module for a Hacker News App.
 *
 *
 */
"use strict";

// #endregion
// #endregion
// #endregion

// #region  J A V A S C R I P T
// #region  F U N C T I O N S

// #region  C O N S T A N T S

// #endregion

// #region  P R I V A T E   F I E L D S

// #endregion

// #region  E N U M E R A T I O N S

// #endregion

// #region  M E T H O D S – P U B L I C

/**
 * HackerNews() - handles searching MIT's Hacker News.
 *                This is the PARENT React Component.
 *
 * @api public
 *
 * @param {type} none no arguments.
 * @returns JSX code to render the search results.
 *
 */
function HackerNews()
{
    const {Fragment, useState, useEffect} = React;
    const [query, setQuery] = useState("MicroCODE");
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    const [{data, isLoading, isError}, doFetch] = useDataApi(
        "https://hn.algolia.com/api/v1/search?query=MicroCODE",
        {
            hits: [],
        }
    );

    const handlePageChange = (e) =>
    {
        setCurrentPage(Number(e.target.textContent));
    };

    let page = data.hits;

    if (page.length >= 1)
    {
        page = getPage(page, currentPage, pageSize);

        console.log(`currentPage: ${currentPage}`);
        console.log(`pageSize: ${pageSize}`);
    }

    return (
        <Fragment>
            <form
                onSubmit={(event) =>
                {
                    doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);

                    event.preventDefault();
                }}
            >
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <button type="submit">Search</button>
                <input id="resultsPerPage"
                    type="number" min="0" max="100" step="1"
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    value={pageSize}
                />
                <button type="submit">Results per Page</button>
            </form>

            {isError && <div>Something went wrong ...</div>}

            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                <ul className="list-group" >
                    {page.map((item) => (
                        <li className="list-group-item" key={item.objectID}>
                            <a href={item.url}>{item.title}</a>
                        </li>
                    ))}
                </ul>
            )}
            <Pagination
                items={data.hits}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            ></Pagination>
        </Fragment>
    );
}

/**
 * Pagination() - handles paginating the results of a net search.
 *                This is a CHILD component of "HackerNews".
 *
 * @api public
 *
 * @param {object} ??? an object representing the current query results, items to show per page, and a page change event handler.
 * @returns JSX code to render the set search results, paginated.
 *
 */
const Pagination = ({items, pageSize, onPageChange}) =>
{
    const {Button} = ReactBootstrap;

    if (items.length <= 1)
    {
        return (
            <nav>
                <ul className="pagination"></ul>
            </nav>
        );
    }

    let numberOfPages = Math.ceil(items.length / pageSize);
    let buttonArray = makePageButtons(1, numberOfPages);

    const pageButtons = buttonArray.map(page =>
    {
        return (
            <Button key={page} onClick={onPageChange} className="page-item">
                {page}
            </Button>
        );
    });

    return (
        <nav>
            <ul className="pagination">{pageButtons}</ul>
        </nav>
    );
};

/**
 * makePageButtons() - returns an array to hold buttons representing Pages.
 *                     This is a HELPER FUNCITON of "HackerNews".
 *
 * @api private
 *
 * @param {number} start the starting page #.
 * @param {number} end the ending page #.
 * @returns array of numbered buttons.
 *
 */
const makePageButtons = (start, end) =>
{
    if (((end - start) <= 0) || !Number.isFinite(start) || !Number.isFinite(end))
    {
        return Array(1)
            .fill(0)
            .map((item, i) => i);
    }
    return Array(end - start + 1)
        .fill(0)
        .map((item, i) => start + i);
};

/**
 * getPage() - returns a slice of the query results representing the current page.
 *             This is a HELPER FUNCTION of "HackerNews".
 *
 * @api private
 *
 * @param {array} items the current search results.
 * @param {number} pageNumber the page number we are displaying.
 * @param {number} pageSize the number of 'items' shown per page.
 * @returns data representing the current page results.
 *
 */
function getPage(items, pageNumber, pageSize)
{
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);

    return page;
}

/**
 * useDataApi() - handles changes in the search query, fetches data.
 *                This is a HELPER FUNCTION of "HackerNews".
 *
 * @api private
 *
 * @param {string} initialUrl the URL we started the display with.
 * @param {array} initialData the results array we began with.
 * @returns data representing the search results.
 *
 */
const useDataApi = (initialUrl, initialData) =>
{
    const {useState, useEffect} = React;

    const [data, setData] = useState(initialData);
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            setIsError(false);
            setIsLoading(true);

            try
            {
                const result = await axios(url);

                setData(result.data);
            }
            catch (error)
            {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();

    }, [url]);

    return [{data, isLoading, isError}, setUrl];
};

// #region  R E A C T   E X E C U T I O N

// "Account" is the PARENT React Component, rendering it creates the control elements of the UI
// which are linked to event handlers.
ReactDOM.render(<HackerNews />, document.getElementById("root"));

// #endregion

// #endregion
// #endregion