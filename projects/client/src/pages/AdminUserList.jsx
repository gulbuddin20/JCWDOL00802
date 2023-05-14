import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { API_URL } from "../helper";
import Axios from "axios";
import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Select,
  ButtonGroup,
} from "@chakra-ui/react";
import PaginationOrder from "../components/OrderComponent/OrderPagination";
import EditUserModal from "../components/UserListComponent/EditUserModal";
import { useSelector } from "react-redux";

function AdminUserList() {
  // STATE
  const [dataUser, setDataUser] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  let userToken = localStorage.getItem("cnc_login");
  let navigate = useNavigate();
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
 
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const handleEditUserClick = (id_user) => {
    setSelectedUserId(id_user);
    setIsEditUserModalOpen(true);
  };
  const handleEditUserClose = () => setIsEditUserModalOpen(false);

  // GET DATA
  const getUser = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      let user = await Axios.post(
        API_URL + `/apis/user/listuser`,
        { search, order, limit, page: parseInt(page) - 1 },
        { headers: { Authorization: `Bearer ${getLocalStorage}` } }
      );
      setPage(user.data.page + 1);
      setDataUser(user.data.data);
      setLastPage(user.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  let dataExist = false;
  if (dataUser == null) {
    dataExist = false;
  } else {
    dataExist = true;
  }

  const [onFilter, setOnFilter] = useState(false);

  const onSetFilter = () => {
    if (search != "" || order != 0) {
      setPage(1);
      setOnFilter(true);
      getUser();
    }
  };

  const onResetFilter = () => {
    setSearch("");
    setOrder(0);
    setOnFilter(false);
  };

  //   USE EFFECT
  useEffect(() => {
    getUser();
  }, [page, limit, onFilter, updateTrigger]);

  //PRINT DATA
  const printData = () => {
    let data = dataExist ? dataUser : [];
    // let num = 0;
    return data.map((val, idx) => {
      return (
        <Tr>
          <Td>{val.full_name}</Td>
          <Td>{val.email}</Td>
          <Td>{val.role === 1 ? "User" : "Warehouse Admin"}</Td>
          <Td>
            {val.role === 2 && (
              <Button
                type="button"
                colorScheme="orange"
                variant="solid"
                onClick={() => handleEditUserClick(val.id_user)}
              >
                Edit User
              </Button>
            )}
          </Td>
        </Tr>
      );
    });
  };

  // ACCESS
  useEffect(() => {
    document.title = "Cnc || Admin User List";
    window.addEventListener("beforeunload", resetPageTitle);
    return () => {
      window.removeEventListener("beforeunload", resetPageTitle());
    };
  }, []);
  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    } else if (role && role == 1) {
      navigate("/");
    } else if (role && role == 2) {
      navigate("/admin");
    }
  }, [role, userToken]);

  const resetPageTitle = () => {
    document.title = "Cnc-ecommerce";
  };

  return (
    <div className="bg-white w-100 m-auto ">
      <div className="d-flex">
        <div className="col-9 rounded p-3 tablebox">
          <TableContainer className="rounded">
            <Table>
              <Thead>
                <Tr className="tablehead">
                  <Th color="#ffffff">Full Name</Th>
                  <Th color="#ffffff">Email</Th>
                  <Th color="#ffffff">Role</Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody className="tablebody">{printData()}</Tbody>
            </Table>
          </TableContainer>
          {dataUser?.length > 0 ? (
            <div
              className="d-flex my-5"
              style={{ alignContent: "center", justifyContent: "center" }}
            >
              <PaginationOrder
                currentPage={parseInt(page)}
                totalPages={parseInt(lastPage)}
                onPageChange={setPage}
                maxLimit={0}
              />
              <div
                className="d-flex mx-5"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                menampilkan
                <Input
                  type="text"
                  placeholder="limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  style={{ width: "60px" }}
                />
                user
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">Tidak ada data</div>
          )}
        </div>
        <div className="col-3 rounded shadow mt-3 p-3 filterbox">
          <div className="inputfilter">
            <div>Filter</div>
            <Input
              type="text"
              className="form-control mt-3"
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inputfilter">
            <Select
              onChange={(e) => setOrder(e.target.value)}
              className="form-control form-control-lg mt-3"
            >
              <option value={0}>Urutkan</option>
              <option value={1} selected={order == 1}>
                Nama:A-Z
              </option>
              <option value={2} selected={order == 2}>
                Nama:Z-A
              </option>
            </Select>
          </div>
          <br />
          <ButtonGroup>
            <Button
              type="button"
              colorScheme="orange"
              variant="solid"
              onClick={() => onSetFilter()}
            >
              Set Filter
            </Button>
            <Button
              type="button"
              colorScheme="orange"
              variant={onFilter ? "solid" : "outline"}
              onClick={() => onResetFilter()}
              isDisabled={!onFilter}
            >
              Reset Filter
            </Button>
          </ButtonGroup>
        </div>
      </div>
      {isEditUserModalOpen && (
        <EditUserModal
          id_user={selectedUserId}
          isOpen={isEditUserModalOpen}
          onClose={handleEditUserClose}
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      )}
    </div>
  );
}

export default AdminUserList;
