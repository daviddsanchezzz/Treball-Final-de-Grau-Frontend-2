<template>
  <router-view />
</template>


<script>


</script>

<style>
.btn-confirm {
  padding: 6px 14px;
  background-color: #00785A;
  color: white;
  border-radius: 6px; 
  transition: background-color 0.2s ease-in-out;
  margin-left: 4px;
}

.btn-confirm:hover {
  background-color: #006747; 
}


.btn-cancel {
  padding: 6px 14px;
  background-color: #e5e7eb; /* bg-gray-200 */
  color: black; /* text-gray-700 */
  border-radius: 6px; /* rounded-md */
  transition: background-color 0.2s ease-in-out;
}

.btn-cancel:hover {
  background-color: #d1d5db; /* hover:bg-gray-300 */
}

.btn-delete {
  padding: 6px 14px;
  background-color: #b91c1c; /* bg-gray-200 */
  color:  white; /* text-gray-700 */
  border-radius: 6px; /* rounded-md */
  transition: background-color 0.2s ease-in-out;
}

.btn-delete:hover{
  background-color:#991b1b ; /* hover:bg-gray-300 */

}

</style>
