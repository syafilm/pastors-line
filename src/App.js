import styled from '@emotion/styled';
import { Modal } from 'components';
import { contacts } from 'api';
import { useEndScreen } from 'hooks';
import React, { useEffect, useState, useRef } from 'react';
import { history, useQuery, debounce} from 'utils';

const App = () => {
  const query = useQuery();
  const countryId = query.countryId ?? ''
  const [showModalA, setShowModalA] = useState(false);
  const [showModalB, setShowModalB] = useState(false);
  const [contactsData, setContactsData] = useState({
    contactsSearch: {},
    contacts: {},
    page: 1, 
    loading: true, 
    total: 0, 
    endOfPage: false,
  });
  const [detailContactData, setDetailContactData] = useState({});
  const [keyword, setKeyword] = useState('');
  const elementRef = useRef(null);
  const {endScreen, setEndScreen} = useEndScreen(elementRef);
  const [checked, setChecked] = useState(false);
  const searchActive = keyword.length > 0

  const getContacts = async(page, keyword, countryId = '') => {
    setContactsData((prev) => ({...prev, loading: true}));
    try {
      const params = new URLSearchParams(countryId ? {
        companyId: 560, noGroupDuplicates: 1, page, countryId, query: keyword,
      } : {
        companyId: 560, noGroupDuplicates: 1, page, query: keyword,
      }).toString();
      const data = await contacts.index(params)
      const allContacts = {...contactsData.contacts, ...data?.data?.contacts}
      setContactsData((prev) => {
        const theContacts = {...prev.contacts, ...data?.data?.contacts}
        return({
          ...prev,
          contacts: keyword ? prev.contacts : theContacts,
          page,
          contactsSearch: data?.data?.contacts,
          loading: false,
          endOfPage: keyword ? false : Object.keys(theContacts).length === data.data.total,
        })
      });
      if(!keyword && Object.keys(allContacts).length === data.data.total){
        setEndScreen(true);
        return;
      }
      setEndScreen(false);
      return;
    } catch (error) {
      console.log(error, 'here')
      throw new Error(`${error}`)
    }
  }

  const onChange = debounce((e) => {
    const keyword = e.target.value ? e.target.value.trim().toLowerCase() : "";
    setKeyword(keyword);
  });

  useEffect(() => {
    if(!contactsData.loading && endScreen && !contactsData.endOfPage && !searchActive){
      const newPage = contactsData.page +1
      getContacts(newPage, keyword, countryId);
    }
  }, [endScreen, keyword, contactsData?.page, contactsData?.endOfPage, contactsData?.loading, countryId, searchActive])

  useEffect(() => {
    if(searchActive){
      getContacts(1, keyword, countryId);
    }else{
      getContacts(1, '', countryId);
    }
  },[countryId, keyword, searchActive]);

  const activeData = searchActive ? contactsData.contactsSearch : contactsData.contacts
  const evenActiveData = checked ? Object.keys(activeData).filter(number => number % 2 === 0) : Object.keys(activeData)

  return(
    <>
      <Wrapper>
        <div className='d-flex h-100 align-items-center row w-100 justify-content-center'>
          <div style={{flex: 'unset'}} className='col w-auto'>
            <button onClick={() => {
              setShowModalA(true);
              setShowModalB(false);
              history.push(`/contacts`)
            }} className='btn btn-success mr-2 btn-custom-a'>
              All Contacts
            </button>
            <button onClick={() => {
              setShowModalB(true);
              setShowModalA(false);
              history.push(`/contacts?countryId=226`)
            }} className='btn btn-warning ml-2 btn-custom-b'>
              US Contacts
            </button>
          </div>
        </div>
      </Wrapper>
      <Modal
        show={(showModalA || showModalB)}
        onClose={() => {
          setShowModalA(false);
          setShowModalB(false);
        }}
        width={`600px`}
        height={`auto`}>
        <Contacts>
          <div className='d-flex mb-3'>
            <button onClick={() => {
                setShowModalA(true);
                setShowModalB(false);
                history.push(`/contacts`)
              }} className='btn btn-success mr-2 btn-custom-a'>
              All Contacts
            </button>
            <button onClick={() => {
                setShowModalB(true);
                setShowModalA(false);
                history.push(`/contacts?countryId=226`)
              }} className='btn btn-warning ml-2 mr-2 btn-custom-b'>
              US Contacts
            </button>
            <button onClick={() => {
                setShowModalB(false);
                setShowModalA(false);
              }} className='btn btn-primary ml-auto'>
              Close
            </button>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <input
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.target.value
                    setKeyword(value);
                  }
                }}
                onChange={onChange}
                placeholder='Search' 
                className='form-control' />
            </div>
          </div>
          <div className='d-flex align-items-center mb-2'>
            {
              searchActive ?
              <b>{countryId ? `Result search ${keyword} from US Contacts` : `Result search ${keyword} from All Contacts`}</b>
              :
              <b>{countryId ? `US Contacts` : `All Contacts`} {Object.keys(evenActiveData).length}</b>
            }
            <div className='d-flex ml-3 align-items-center'>
              <input value={checked} onClick={() => setChecked(!checked)} type="checkbox" id="check"/>
              <label className='ml-2 mb-0' htmlFor="check">Only even</label>
            </div>
          </div>
          <ul>
            {
              evenActiveData.map(contact => {
                return(
                  <li onClick={() => {
                    setShowModalB(false);
                    setShowModalA(false);
                    setDetailContactData(activeData[`${contact}`]);
                  }} style={{color: `${activeData[`${contact}`].color}`}} key={contact}>{activeData[`${contact}`].first_name} - {activeData[`${contact}`].phone_number} - {contact}</li>
                )
              })
            }
          </ul>
          <div style={{height: '20px', marginTop: 'auto'}} ref={elementRef}/>

          {contactsData.endOfPage && (
            <div className='text-center'>
              <span>all data already loaded</span>
            </div>
          )}
        </Contacts>
      </Modal>
      <Modal
        show={Object.keys(detailContactData).length > 0}
        onClose={() => {
          setDetailContactData({});
          setShowModalB(false);
          setShowModalA(false);
        }}
        width={`600px`}
        height={`auto`}>
        <Contact>
          <ul>
            <li>
              <div className='row'>
                <div className='col-md-3'>Name</div>
                <div className='col-md-1'>:</div>
                <div className='col-md-3'>{detailContactData?.first_name} {detailContactData?.last_name}</div>
              </div>
            </li>
            <li>
              <div className='row'>
                <div className='col-md-3'>Email</div>
                <div className='col-md-1'>:</div>
                <div className='col-md-3'>{detailContactData?.email}</div>
              </div>
            </li>
            <li>
              <div className='row'>
                <div className='col-md-3'>Phone number</div>
                <div className='col-md-1'>:</div>
                <div className='col-md-3'>{detailContactData?.phone_number}</div>
              </div>
            </li>
          </ul>
        </Contact>
      </Modal>
    </>
  )
}

export default App;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Contact = styled.div`
  padding: 15px;
  ul{
    padding: 0px;
    list-style: none;
    padding: 0px;
    margin: 0px;
    li{
      margin-bottom: 0.5rem;
      &:last-of-type{
        margin-bottom: 0px;
      }
    }
  }
`

const Contacts = styled.div`
  padding: 15px;
  max-height: 400px;
  overflow-y: scroll;
  b{
    display: block;
  }
  ul{
    padding: 0px;
    list-style: none;
    li{
      cursor: pointer;
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0.5);
      padding: 6px; 8px;
      margin-bottom: 0.5rem;
    }
  }
`